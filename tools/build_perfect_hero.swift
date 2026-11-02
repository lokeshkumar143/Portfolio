import Foundation
import AVFoundation
import Vision
import CoreGraphics
import ImageIO

let sourceVideo = "assets_src/Man_walking_toward_camera_fd3ece83_1080p.mp4"
let outVideoPath = "public/media/hero.mp4"
let outPosterPath = "public/media/hero.jpg"
let outManifestPath = "public/media/manifest.json"

let asset = AVAsset(url: URL(fileURLWithPath: sourceVideo))
guard let videoTrack = asset.tracks(withMediaType: .video).first else {
    fatalError("No video track found")
}

let reader = try AVAssetReader(asset: asset)
let readerOutput = AVAssetReaderTrackOutput(track: videoTrack, outputSettings: [
    kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA
])
reader.add(readerOutput)
guard reader.startReading() else {
    fatalError("Could not start reading video: \(String(describing: reader.error))")
}

let tempOutURL = URL(fileURLWithPath: "/tmp/hero_temp.mp4")
try? FileManager.default.removeItem(at: tempOutURL)

let writer = try AVAssetWriter(outputURL: tempOutURL, fileType: .mp4)
writer.shouldOptimizeForNetworkUse = true

let videoSettings: [String: Any] = [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoWidthKey: 1440,
    AVVideoHeightKey: 1280,
    AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: 5_500_000,
        AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
        AVVideoExpectedSourceFrameRateKey: 30
    ]
]

let writerInput = AVAssetWriterInput(mediaType: .video, outputSettings: videoSettings)
writerInput.expectsMediaDataInRealTime = false

let sourcePixelBufferAttributes: [String: Any] = [
    kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
    kCVPixelBufferWidthKey as String: 1440,
    kCVPixelBufferHeightKey as String: 1280
]

let adaptor = AVAssetWriterInputPixelBufferAdaptor(
    assetWriterInput: writerInput,
    sourcePixelBufferAttributes: sourcePixelBufferAttributes
)

writer.add(writerInput)
guard writer.startWriting() else {
    fatalError("Writer failed to start: \(String(describing: writer.error))")
}
writer.startSession(atSourceTime: .zero)

let req = VNGeneratePersonSegmentationRequest()
req.qualityLevel = .accurate
req.outputPixelFormat = kCVPixelFormatType_OneComponent8

let cropW = 608
let cropH = 1080
let targetW = 720
let targetH = 1280

let scaleX = Double(targetW) / Double(cropW)
let scaleY = Double(targetH) / Double(cropH)

// Pre-allocate working buffers
let cleanMask = UnsafeMutablePointer<UInt8>.allocate(capacity: targetW * targetH)
let erodedMask = UnsafeMutablePointer<UInt8>.allocate(capacity: targetW * targetH)

var tracks: [[Double]] = []
var frameCount = 0
let t0 = CFAbsoluteTimeGetCurrent()

print("Beginning perfect hero defringe & despill encoding...")

while let sampleBuffer = readerOutput.copyNextSampleBuffer() {
    guard let srcPB = CMSampleBufferGetImageBuffer(sampleBuffer) else { continue }
    let pts = CMSampleBufferGetPresentationTimeStamp(sampleBuffer)
    
    // 1. Accurate segmentation
    let handler = VNImageRequestHandler(cvPixelBuffer: srcPB, options: [:])
    try? handler.perform([req])
    
    guard let maskPB = req.results?.first?.pixelBuffer else { continue }
    
    // 2. Measure bounding box from mask
    CVPixelBufferLockBaseAddress(maskPB, .readOnly)
    let mw = CVPixelBufferGetWidth(maskPB)
    let mh = CVPixelBufferGetHeight(maskPB)
    let mptr = CVPixelBufferGetBaseAddress(maskPB)!.assumingMemoryBound(to: UInt8.self)
    let mbpr = CVPixelBufferGetBytesPerRow(maskPB)
    
    var minX = mw, maxX = 0, minY = mh, maxY = 0
    for y in 0..<mh {
        let rowOff = y * mbpr
        for x in 0..<mw {
            if mptr[rowOff + x] > 120 {
                if x < minX { minX = x }
                if x > maxX { maxX = x }
                if y < minY { minY = y }
                if y > maxY { maxY = y }
            }
        }
    }
    
    var maskCG: CGImage?
    if let maskContext = CGContext(
        data: CVPixelBufferGetBaseAddress(maskPB),
        width: mw,
        height: mh,
        bitsPerComponent: 8,
        bytesPerRow: mbpr,
        space: CGColorSpaceCreateDeviceGray(),
        bitmapInfo: CGImageAlphaInfo.none.rawValue
    ) {
        maskCG = maskContext.makeImage()
    }
    CVPixelBufferUnlockBaseAddress(maskPB, .readOnly)
    
    // Center point in source coords (1920x1080)
    let personCenterX = Double(minX + maxX) * 0.5 * (1920.0 / Double(mw))
    let cropOriginX = Int(max(0, min(1920.0 - Double(cropW), personCenterX - Double(cropW) * 0.5)))
    
    // Normalized track coordinates for manifest
    let personSrcMinX = Double(minX) * (1920.0 / Double(mw))
    let personSrcMaxX = Double(maxX) * (1920.0 / Double(mw))
    let personSrcMinY = Double(minY) * (1080.0 / Double(mh))
    let personSrcMaxY = Double(maxY) * (1080.0 / Double(mh))
    
    let normX0 = max(0.0, (personSrcMinX - Double(cropOriginX)) / Double(cropW))
    let normX1 = min(1.0, (personSrcMaxX - Double(cropOriginX)) / Double(cropW))
    let normY0 = max(0.0, personSrcMinY / Double(cropH))
    let normY1 = min(1.0, personSrcMaxY / Double(cropH))
    tracks.append([
        round(normX0 * 10000) / 10000,
        round(normY0 * 10000) / 10000,
        round(normX1 * 10000) / 10000,
        round(normY1 * 10000) / 10000
    ])
    
    // 3. Render color crop with correct BGRA Little Endian bitmap info
    CVPixelBufferLockBaseAddress(srcPB, .readOnly)
    let sw = CVPixelBufferGetWidth(srcPB)
    let sh = CVPixelBufferGetHeight(srcPB)
    let sbpr = CVPixelBufferGetBytesPerRow(srcPB)
    var srcCG: CGImage?
    if let srcContext = CGContext(
        data: CVPixelBufferGetBaseAddress(srcPB),
        width: sw,
        height: sh,
        bitsPerComponent: 8,
        bytesPerRow: sbpr,
        space: CGColorSpaceCreateDeviceRGB(),
        bitmapInfo: CGBitmapInfo.byteOrder32Little.rawValue | CGImageAlphaInfo.noneSkipFirst.rawValue
    ) {
        srcCG = srcContext.makeImage()
    }
    CVPixelBufferUnlockBaseAddress(srcPB, .readOnly)
    
    guard let colorImg = srcCG, let maskImg = maskCG else { continue }
    
    let colorCtx = CGContext(
        data: nil,
        width: targetW,
        height: targetH,
        bitsPerComponent: 8,
        bytesPerRow: targetW * 4,
        space: CGColorSpaceCreateDeviceRGB(),
        bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue
    )!
    colorCtx.scaleBy(x: scaleX, y: scaleY)
    colorCtx.translateBy(x: -Double(cropOriginX), y: 0)
    colorCtx.draw(colorImg, in: CGRect(x: 0, y: 0, width: sw, height: sh))
    
    let maskCtx = CGContext(
        data: nil,
        width: targetW,
        height: targetH,
        bitsPerComponent: 8,
        bytesPerRow: targetW,
        space: CGColorSpaceCreateDeviceGray(),
        bitmapInfo: CGImageAlphaInfo.none.rawValue
    )!
    maskCtx.scaleBy(x: scaleX, y: scaleY)
    maskCtx.translateBy(x: -Double(cropOriginX), y: 0)
    maskCtx.scaleBy(x: 1920.0 / Double(mw), y: 1080.0 / Double(mh))
    maskCtx.draw(maskImg, in: CGRect(x: 0, y: 0, width: mw, height: mh))
    
    let cPtr = colorCtx.data!.assumingMemoryBound(to: UInt8.self)
    let mRawPtr = maskCtx.data!.assumingMemoryBound(to: UInt8.self)
    
    // 4. Eliminate white studio cyclorama background leaks from mask
    for y in 0..<targetH {
        let y_top = targetH - 1 - y
        let rowIdx = y * targetW
        for x in 0..<targetW {
            let idx = rowIdx + x
            let mVal = mRawPtr[idx]
            
            let cOff = idx * 4
            let r = cPtr[cOff]
            let g = cPtr[cOff+1]
            let b = cPtr[cOff+2]
            
            let minC = min(r, min(g, b))
            let maxC = max(r, max(g, b))
            let isCycloramaWhite = (minC > 160) && ((maxC - minC) < 28)
            let inShirt = (y_top >= 220 && y_top <= 520) && (x >= 290 && x <= 430)
            
            if isCycloramaWhite && !inShirt {
                cleanMask[idx] = 0
            } else {
                cleanMask[idx] = mVal
            }
        }
    }
    
    // 5. Morphological 1-pixel erosion
    let rRadius = 1
    for y in 0..<targetH {
        let yMin = max(0, y - rRadius)
        let yMax = min(targetH - 1, y + rRadius)
        let rowIdx = y * targetW
        for x in 0..<targetW {
            let xMin = max(0, x - rRadius)
            let xMax = min(targetW - 1, x + rRadius)
            var minVal = cleanMask[rowIdx + x]
            for dy in yMin...yMax {
                let dRow = dy * targetW
                for dx in xMin...xMax {
                    let v = cleanMask[dRow + dx]
                    if v < minVal { minVal = v }
                }
            }
            erodedMask[rowIdx + x] = minVal
        }
    }
    
    // 6. Allocate output pixel buffer (1440x1280)
    while !writerInput.isReadyForMoreMediaData {
        Thread.sleep(forTimeInterval: 0.004)
    }
    
    var outputPB: CVPixelBuffer?
    if let pool = adaptor.pixelBufferPool {
        CVPixelBufferPoolCreatePixelBuffer(nil, pool, &outputPB)
    }
    if outputPB == nil {
        var pb: CVPixelBuffer?
        CVPixelBufferCreate(
            nil, 1440, 1280,
            kCVPixelFormatType_32BGRA,
            sourcePixelBufferAttributes as CFDictionary,
            &pb
        )
        outputPB = pb
    }
    
    guard let dstPB = outputPB else { continue }
    CVPixelBufferLockBaseAddress(dstPB, [])
    let dstPtr = CVPixelBufferGetBaseAddress(dstPB)!.assumingMemoryBound(to: UInt8.self)
    let dstBpr = CVPixelBufferGetBytesPerRow(dstPB)
    
    // 7. Compose packed frame: left color on black, right grayscale matte
    for y_top in 0..<targetH {
        let y_cg = targetH - 1 - y_top
        let cgRow = y_cg * targetW
        let pbRow = y_top * dstBpr
        
        for x in 0..<targetW {
            let idx = cgRow + x
            let mVal = erodedMask[idx]
            
            let aRaw = Double(mVal) / 255.0
            let a: Double
            if aRaw < 0.15 {
                a = 0.0
            } else if aRaw > 0.85 {
                a = 1.0
            } else {
                let t = (aRaw - 0.15) / (0.85 - 0.15)
                a = t * t * (3.0 - 2.0 * t)
            }
            
            let cOff = idx * 4
            let rOrig = Double(cPtr[cOff])
            let gOrig = Double(cPtr[cOff+1])
            let bOrig = Double(cPtr[cOff+2])
            
            var rOut = 0.0
            var gOut = 0.0
            var bOut = 0.0
            
            if a > 0.0 {
                let inShirt = (y_top >= 220 && y_top <= 520) && (x >= 290 && x <= 430)
                if !inShirt {
                    // Despill white studio light
                    let despillAmount = (1.0 - a) * 215.0
                    let rSub = max(0.0, rOrig - despillAmount)
                    let gSub = max(0.0, gOrig - despillAmount)
                    let bSub = max(0.0, bOrig - despillAmount)
                    rOut = min(255.0, rSub * a)
                    gOut = min(255.0, gSub * a)
                    bOut = min(255.0, bSub * a)
                } else {
                    rOut = min(255.0, rOrig * a)
                    gOut = min(255.0, gOrig * a)
                    bOut = min(255.0, bOrig * a)
                }
            }
            
            // Left half: BGRA format for CVPixelBuffer (Blue, Green, Red, Alpha)
            let pbLeft = pbRow + x * 4
            dstPtr[pbLeft]     = UInt8(bOut)
            dstPtr[pbLeft + 1] = UInt8(gOut)
            dstPtr[pbLeft + 2] = UInt8(rOut)
            dstPtr[pbLeft + 3] = 255
            
            // Right half: grayscale matte
            let pbRight = pbRow + (targetW + x) * 4
            let mByte = UInt8(min(255.0, round(a * 255.0)))
            dstPtr[pbRight]     = mByte
            dstPtr[pbRight + 1] = mByte
            dstPtr[pbRight + 2] = mByte
            dstPtr[pbRight + 3] = 255
        }
    }
    
    CVPixelBufferUnlockBaseAddress(dstPB, [])
    adaptor.append(dstPB, withPresentationTime: pts)
    
    // Save first frame poster (color on black)
    if frameCount == 0 {
        let posterCtx = CGContext(
            data: nil,
            width: targetW,
            height: targetH,
            bitsPerComponent: 8,
            bytesPerRow: targetW * 4,
            space: CGColorSpaceCreateDeviceRGB(),
            bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue
        )!
        let pPtr = posterCtx.data!.assumingMemoryBound(to: UInt8.self)
        for y_top in 0..<targetH {
            let y_cg = targetH - 1 - y_top
            let cgRow = y_cg * targetW
            let pRow = y_cg * targetW * 4
            for x in 0..<targetW {
                let idx = cgRow + x
                let mVal = erodedMask[idx]
                let aRaw = Double(mVal) / 255.0
                let a: Double = (aRaw < 0.15) ? 0.0 : ((aRaw > 0.85) ? 1.0 : {
                    let t = (aRaw - 0.15) / 0.70
                    return t * t * (3.0 - 2.0 * t)
                }())
                
                let cOff = idx * 4
                let rOrig = Double(cPtr[cOff])
                let gOrig = Double(cPtr[cOff+1])
                let bOrig = Double(cPtr[cOff+2])
                
                let inShirt = (y_top >= 220 && y_top <= 520) && (x >= 290 && x <= 430)
                let rSub = inShirt ? rOrig : max(0.0, rOrig - (1.0 - a) * 215.0)
                let gSub = inShirt ? gOrig : max(0.0, gOrig - (1.0 - a) * 215.0)
                let bSub = inShirt ? bOrig : max(0.0, bOrig - (1.0 - a) * 215.0)
                
                let pOff = pRow + x * 4
                pPtr[pOff]     = UInt8(min(255.0, rSub * a))
                pPtr[pOff + 1] = UInt8(min(255.0, gSub * a))
                pPtr[pOff + 2] = UInt8(min(255.0, bSub * a))
                pPtr[pOff + 3] = 255
            }
        }
        if let posterCG = posterCtx.makeImage() {
            let pURL = URL(fileURLWithPath: outPosterPath)
            if let dest = CGImageDestinationCreateWithURL(pURL as CFURL, "public.jpeg" as CFString, 1, nil) {
                CGImageDestinationAddImage(dest, posterCG, nil)
                CGImageDestinationFinalize(dest)
                print("Saved crisp clean hero poster to \(outPosterPath)")
            }
        }
    }
    
    frameCount += 1
    if frameCount % 30 == 0 {
        let elapsed = CFAbsoluteTimeGetCurrent() - t0
        let fps = Double(frameCount) / elapsed
        print("Encoded \(frameCount) frames (speed: \(String(format: "%.1f", fps)) fps)...")
    }
}

writerInput.markAsFinished()
let sema = DispatchSemaphore(value: 0)
writer.finishWriting {
    sema.signal()
}
sema.wait()

let totalTime = CFAbsoluteTimeGetCurrent() - t0
print("Finished encoding \(frameCount) frames in \(String(format: "%.2f", totalTime))s!")

// Atomically replace public/media/hero.mp4
try? FileManager.default.removeItem(at: URL(fileURLWithPath: outVideoPath))
try FileManager.default.moveItem(at: tempOutURL, to: URL(fileURLWithPath: outVideoPath))
print("Overwrote \(outVideoPath) successfully!")

// Update manifest.json
let manifestURL = URL(fileURLWithPath: outManifestPath)
if let data = try? Data(contentsOf: manifestURL),
   var json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
   var clips = json["clips"] as? [String: Any],
   var heroInfo = clips["hero"] as? [String: Any] {
    heroInfo["track"] = tracks
    heroInfo["frames"] = frameCount
    clips["hero"] = heroInfo
    json["clips"] = clips
    let updatedData = try JSONSerialization.data(withJSONObject: json, options: .prettyPrinted)
    try updatedData.write(to: manifestURL)
    print("Updated \(outManifestPath) with \(tracks.count) track coordinates.")
}

cleanMask.deallocate()
erodedMask.deallocate()
