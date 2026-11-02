import Foundation
import AVFoundation
import CoreVideo
import CoreGraphics
import CoreImage

func cleanVideo(inputURL: URL, outputURL: URL, posterURL: URL) {
    print("Processing: \(inputURL.lastPathComponent) -> \(outputURL.lastPathComponent)...")
    let asset = AVURLAsset(url: inputURL)
    
    guard let videoTrack = asset.tracks(withMediaType: .video).first else {
        print("Error: No video track found in \(inputURL.path)")
        return
    }
    
    let naturalSize = videoTrack.naturalSize
    let width = Int(naturalSize.width)
    let height = Int(naturalSize.height)
    let nominalFrameRate = videoTrack.nominalFrameRate > 0 ? videoTrack.nominalFrameRate : 30.0
    
    // Setup reader
    guard let reader = try? AVAssetReader(asset: asset) else {
        print("Error creating AVAssetReader")
        return
    }
    
    let outputSettings: [String: Any] = [
        kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
        kCVPixelBufferMetalCompatibilityKey as String: true
    ]
    let trackOutput = AVAssetReaderTrackOutput(track: videoTrack, outputSettings: outputSettings)
    trackOutput.alwaysCopiesSampleData = false
    reader.add(trackOutput)
    
    if !reader.startReading() {
        print("Error: reader.startReading() failed")
        return
    }
    
    // Setup writer
    if FileManager.default.fileExists(atPath: outputURL.path) {
        try? FileManager.default.removeItem(at: outputURL)
    }
    
    guard let writer = try? AVAssetWriter(outputURL: outputURL, fileType: .mp4) else {
        print("Error creating AVAssetWriter")
        return
    }
    writer.shouldOptimizeForNetworkUse = true
    
    let videoSettings: [String: Any] = [
        AVVideoCodecKey: AVVideoCodecType.h264,
        AVVideoWidthKey: width,
        AVVideoHeightKey: height,
        AVVideoCompressionPropertiesKey: [
            AVVideoAverageBitRateKey: 8_000_000,
            AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
            AVVideoExpectedSourceFrameRateKey: nominalFrameRate,
            AVVideoMaxKeyFrameIntervalKey: Int(nominalFrameRate * 2)
        ]
    ]
    
    let writerInput = AVAssetWriterInput(mediaType: .video, outputSettings: videoSettings)
    writerInput.expectsMediaDataInRealTime = false
    
    let sourceBufferAttributes: [String: Any] = [
        kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
        kCVPixelBufferWidthKey as String: width,
        kCVPixelBufferHeightKey as String: height
    ]
    let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: writerInput, sourcePixelBufferAttributes: sourceBufferAttributes)
    
    writer.add(writerInput)
    if !writer.startWriting() {
        print("Error: writer.startWriting() failed: \(String(describing: writer.error))")
        return
    }
    writer.startSession(atSourceTime: .zero)
    
    // Inpainting coordinates (bottom right in 1920x1080, scale proportionally if different)
    let scaleW = Double(width) / 1920.0
    let scaleH = Double(height) / 1080.0
    let x0 = Int(1660.0 * scaleW)
    let x1 = min(width, Int(1830.0 * scaleW))
    let y0 = Int(830.0 * scaleH)
    let y1 = min(height, Int(980.0 * scaleH))
    let rw = x1 - x0
    let rh = y1 - y0
    let feather = max(6, Int(14.0 * scaleW))
    
    var frameIndex = 0
    let ciCtx = CIContext()
    var savedPoster = false
    
    while reader.status == .reading {
        guard let sampleBuffer = trackOutput.copyNextSampleBuffer() else { break }
        guard let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { continue }
        let presentationTime = CMSampleBufferGetPresentationTimeStamp(sampleBuffer)
        
        // Inpaint in place
        CVPixelBufferLockBaseAddress(pixelBuffer, [])
        if let baseAddress = CVPixelBufferGetBaseAddress(pixelBuffer) {
            let bpr = CVPixelBufferGetBytesPerRow(pixelBuffer)
            let ptr = baseAddress.assumingMemoryBound(to: UInt8.self)
            
            for y in y0..<y1 {
                let ty = Double(y - y0) / Double(rh - 1)
                let rowOffset = y * bpr
                
                for x in x0..<x1 {
                    let tx = Double(x - x0) / Double(rw - 1)
                    let pxOffset = rowOffset + x * 4
                    
                    let topOffset = y0 * bpr + x * 4
                    let botOffset = (y1 - 1) * bpr + x * 4
                    let leftOffset = y * bpr + x0 * 4
                    let rightOffset = y * bpr + (x1 - 1) * 4
                    
                    for c in 0..<3 { // BGRA: c=0 (B), c=1 (G), c=2 (R)
                        let topVal = Double(ptr[topOffset + c])
                        let botVal = Double(ptr[botOffset + c])
                        let leftVal = Double(ptr[leftOffset + c])
                        let rightVal = Double(ptr[rightOffset + c])
                        
                        let blendY = (1.0 - ty) * topVal + ty * botVal
                        let blendX = (1.0 - tx) * leftVal + tx * rightVal
                        var inpaint = 0.5 * (blendY + blendX)
                        
                        let distEdge = min(min(x - x0, x1 - 1 - x), min(y - y0, y1 - 1 - y))
                        if distEdge < feather {
                            let alpha = Double(distEdge) / Double(feather)
                            let origVal = Double(ptr[pxOffset + c])
                            inpaint = (1.0 - alpha) * origVal + alpha * inpaint
                        }
                        ptr[pxOffset + c] = UInt8(max(0, min(255, round(inpaint))))
                    }
                }
            }
        }
        CVPixelBufferUnlockBaseAddress(pixelBuffer, [])
        
        // Save first frame as poster
        if !savedPoster {
            let ci = CIImage(cvPixelBuffer: pixelBuffer)
            try? ciCtx.writeJPEGRepresentation(of: ci, to: posterURL, colorSpace: CGColorSpaceCreateDeviceRGB(), options: [:])
            savedPoster = true
        }
        
        // Write frame
        while !writerInput.isReadyForMoreMediaData {
            Thread.sleep(forTimeInterval: 0.005)
        }
        adaptor.append(pixelBuffer, withPresentationTime: presentationTime)
        frameIndex += 1
    }
    
    writerInput.markAsFinished()
    let semaphore = DispatchSemaphore(value: 0)
    writer.finishWriting {
        semaphore.signal()
    }
    semaphore.wait()
    print("Done \(outputURL.lastPathComponent): \(frameIndex) frames cleanly encoded without watermark!")
}

let args = CommandLine.arguments
if args.count > 3 {
    let inUrl = URL(fileURLWithPath: args[1])
    let outUrl = URL(fileURLWithPath: args[2])
    let posterUrl = URL(fileURLWithPath: args[3])
    cleanVideo(inputURL: inUrl, outputURL: outUrl, posterURL: posterUrl)
} else {
    print("Usage: clean_videos <input> <output> <poster>")
}

