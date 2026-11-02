import Foundation
import AVFoundation
import Vision
import CoreImage
import CoreGraphics
import ImageIO

let sourceVideo = "assets_src/Man_walking_toward_camera_fd3ece83_1080p.mp4"
let asset = AVAsset(url: URL(fileURLWithPath: sourceVideo))
let gen = AVAssetImageGenerator(asset: asset)
gen.appliesPreferredTrackTransform = true
gen.requestedTimeToleranceBefore = .zero
gen.requestedTimeToleranceAfter = .zero

let time = CMTime(seconds: 2.0, preferredTimescale: 600)
guard let cgImage = try? gen.copyCGImage(at: time, actualTime: nil) else { fatalError() }

let req = VNGeneratePersonSegmentationRequest()
req.qualityLevel = .accurate
req.outputPixelFormat = kCVPixelFormatType_OneComponent8

let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
try? handler.perform([req])
guard let maskPB = req.results?.first?.pixelBuffer else { fatalError() }

let cropW: CGFloat = 608
let cropH: CGFloat = 1080
let targetW: CGFloat = 720
let targetH: CGFloat = 1280
let scaleX = targetW / cropW
let scaleY = targetH / cropH

// Measure person center
CVPixelBufferLockBaseAddress(maskPB, .readOnly)
let mw = CVPixelBufferGetWidth(maskPB)
let mh = CVPixelBufferGetHeight(maskPB)
let mptr = CVPixelBufferGetBaseAddress(maskPB)!.assumingMemoryBound(to: UInt8.self)
let mbpr = CVPixelBufferGetBytesPerRow(maskPB)

var minX = mw, maxX = 0, minY = mh, maxY = 0
for y in 0..<mh {
    for x in 0..<mw {
        if mptr[y * mbpr + x] > 120 {
            if x < minX { minX = x }
            if x > maxX { maxX = x }
            if y < minY { minY = y }
            if y > maxY { maxY = y }
        }
    }
}
CVPixelBufferUnlockBaseAddress(maskPB, .readOnly)

let personCenterX = CGFloat(minX + maxX) * 0.5 * (1920.0 / CGFloat(mw))
let cropOriginX = max(0, min(1920.0 - cropW, personCenterX - cropW * 0.5))

let ciSrc = CIImage(cgImage: cgImage)
let ciMaskRaw = CIImage(cvPixelBuffer: maskPB)
let maskScaleX = 1920.0 / ciMaskRaw.extent.width
let maskScaleY = 1080.0 / ciMaskRaw.extent.height
let ciMask = ciMaskRaw.transformed(by: CGAffineTransform(scaleX: maskScaleX, y: maskScaleY))

let cropRect = CGRect(x: cropOriginX, y: 0, width: cropW, height: cropH)
let croppedColor = ciSrc.cropped(to: cropRect).transformed(by: CGAffineTransform(translationX: -cropOriginX, y: 0))
let croppedMask = ciMask.cropped(to: cropRect).transformed(by: CGAffineTransform(translationX: -cropOriginX, y: 0))

let scaledColor = croppedColor.transformed(by: CGAffineTransform(scaleX: scaleX, y: scaleY))
let scaledMask = croppedMask.transformed(by: CGAffineTransform(scaleX: scaleX, y: scaleY))

// 1. Erode the mask by 1.5 pixels
let erode = CIFilter(name: "CIMorphologyMinimum")!
erode.setValue(scaledMask, forKey: kCIInputImageKey)
erode.setValue(1.5, forKey: kCIInputRadiusKey)
let erodedMask = erode.outputImage!.cropped(to: CGRect(x: 0, y: 0, width: targetW, height: targetH))

// 2. Convert mask to alpha
let maskToAlpha = CIFilter(name: "CIMaskToAlpha")!
maskToAlpha.setValue(erodedMask, forKey: kCIInputImageKey)
let alphaMask = maskToAlpha.outputImage!

// 3. Blend color over pure black using alphaMask
let blend = CIFilter(name: "CIBlendWithAlphaMask")!
blend.setValue(scaledColor, forKey: kCIInputImageKey)
blend.setValue(CIImage(color: CIColor.black), forKey: kCIInputBackgroundImageKey)
blend.setValue(alphaMask, forKey: kCIInputMaskImageKey)
let cleanColorOnBlack = blend.outputImage!.cropped(to: CGRect(x: 0, y: 0, width: targetW, height: targetH))

// 4. Position mask on right half (+720)
let rightMask = erodedMask.transformed(by: CGAffineTransform(translationX: targetW, y: 0))
let packedCI = rightMask.composited(over: cleanColorOnBlack)

let ctx = CIContext(options: [.useSoftwareRenderer: false])
if let finalCG = ctx.createCGImage(packedCI, from: CGRect(x: 0, y: 0, width: 1440, height: targetH)) {
    let outURL = URL(fileURLWithPath: "tools/test_ci_packed.jpg")
    let dest = CGImageDestinationCreateWithURL(outURL as CFURL, "public.jpeg" as CFString, 1, nil)!
    CGImageDestinationAddImage(dest, finalCG, nil)
    CGImageDestinationFinalize(dest)
    print("Wrote tools/test_ci_packed.jpg (1440x1280)")
}
