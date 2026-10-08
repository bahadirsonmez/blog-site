---
title: "Implement Real-time Filtering With CIFilter"
description: "Perform Core Image filtering on live AVFoundation camera frames and render the result in real time."
date: 2022-11-10
tags: [apple-dev, cifilter, metal, ios, apple, swift]
status: ready
medium_url: https://medium.com/better-programming/real-time-filtering-with-cifilter-bf7af16aee04
medium_publication: Better Programming
---
<figure><img src="/assets/posts/real-time-filtering-with-cifilter/img-1.jpg" alt="A hand holding a camera lens filter" loading="lazy"><figcaption>Photo by <a href="https://unsplash.com/@habibdadkhah?utm_source=medium&amp;utm_medium=referral">Habib Dadkhah</a> on&nbsp;<a href="https://unsplash.com?utm_source=medium&amp;utm_medium=referral">Unsplash</a></figcaption></figure>

In my [previous article](/posts/creating-a-custom-filter-with-cifilter/), I talked about creating a custom filter with CIFilter. In this article, I will talk about how to use CIFilter filters for real-time filtering. Camera usage and camera usage permission are required for the application to work. Make sure you ask for the Privacy — Camera Usage Description permission in Info.plist.

First, let’s create a class called CameraCapture to process and transfer the images captured by the camera. This class is initialized with a camera position and a callback closure.

```swift
typealias Callback = (CIImage?) -> ()
private let position: AVCaptureDevice.Position
private let callback: Callback
init(position: AVCaptureDevice.Position = .front, callback: @escaping Callback) {
  self.position = position
  self.callback = callback
  super.init()
}
```

Define an AVCaptureSession and a user-initiated DispatchQueue in the class. It’s important to define userInitiated, as it will always appear in the UI.

```swift
private let session = AVCaptureSession()
private let bufferQueue = DispatchQueue(label: "someLabel", qos: .userInitiated)
```

Write two public functions to start and end the session since the session is private.

```swift
func start() {
  session.startRunning()
}
```

```swift
func stop() {
  session.stopRunning()
}
```

Create a function for session configuration and call it after super.init(). To process the images captured by the camera, CameraCapture must conform to the AVCaptureVideoDataOutputSampleBufferDelegate protocol.

```swift
private func configureSession() {
// 1
session.sessionPreset = .hd1280x720
// 2
let discovery = AVCaptureDevice.DiscoverySession(deviceTypes: [.builtInDualCamera, .builtInWideAngleCamera], mediaType: .video, position: position)
guard let camera = discovery.devices.first, let input = try? AVCaptureDeviceInput(device: camera) else {
// Error handling
return
}
session.addInput(input)
// 3
let output = AVCaptureVideoDataOutput()
output.setSampleBufferDelegate(self, queue: bufferQueue)
session.addOutput(output)
}
```

Let’s take a step-by-step look at what’s inside the function.

1\. Determining the image quality.  
2\. Finding and configuring suitable video-capturing elements with AVCaptureDevice.DiscoverySession and creating capture input with AVCaptureDeviceInput  
3\. Create the output with AVCaptureVideoDataOutput and add the delegate to the class

The captured image needs to be converted to CIImage and fed into the callback closure. Write an extension for CameraCapture that conforms AVCaptureVideoDataOutputSampleBufferDelegate for this.

```swift
extension CameraCapture:AVCaptureVideoDataOutputSampleBufferDelegate {
  func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
    guard let imageBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return }
    DispatchQueue.main.async {
      let image = CIImage(cvImageBuffer: imageBuffer)
      self.callback(image.transformed(by: CGAffineTransform(rotationAngle: 3 * .pi / 2)))
    }
  }
}
```

Create a CIImage with the sampleBuffer from the delegate function and pass it to the callback. Since the incoming image is sideways, it is necessary to rotate it 270 degrees. As a result, the following class is created.

*cameraCapture.swift*

```swift
import AVFoundation
import CoreImage

class CameraCapture: NSObject {
    typealias Callback = (CIImage?) -> ()
    
    private let position: AVCaptureDevice.Position
    private let callback: Callback
    private let session = AVCaptureSession()
    private let bufferQueue = DispatchQueue(label: "someLabel", qos: .userInitiated)
    
    init(position: AVCaptureDevice.Position = .front, callback: @escaping Callback) {
        self.position = position
        self.callback = callback
        
        super.init()
        configureSession()
    }
    
    func start() {
        session.startRunning()
    }
    
    func stop() {
        session.stopRunning()
    }
    
    private func configureSession() {
        session.sessionPreset = .hd1280x720
        
        let discovery = AVCaptureDevice.DiscoverySession(deviceTypes: [.builtInDualCamera, .builtInWideAngleCamera], mediaType: .video, position: position)
        guard let camera = discovery.devices.first, let input = try? AVCaptureDeviceInput(device: camera) else {
            // Error handling
            return
        }
        session.addInput(input)
        
        let output = AVCaptureVideoDataOutput()
        output.setSampleBufferDelegate(self, queue: bufferQueue)
        session.addOutput(output)
    }
}

extension CameraCapture: AVCaptureVideoDataOutputSampleBufferDelegate {
    func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
        guard let imageBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return }
        
        DispatchQueue.main.async {
            let image = CIImage(cvImageBuffer: imageBuffer)
            self.callback(image.transformed(by: CGAffineTransform(rotationAngle: 3 * .pi / 2)))
        }
    }
}
```

After creating the CameraCapture class without any problems, filtering can be performed using this class. Create a ViewController with UIImageView and CameraCapture instances.

```swift
class RealtimeFilterViewController: UIViewController {
  var imageView: UIImageView!
  var cameraCapture: CICameraCapture?
  override func viewDidLoad() {
    super.viewDidLoad()
    imageView = UIImageView(frame: view.bounds)
    view.addSubview(imageView)
    cameraCapture = CICameraCapture(cameraPosition: .front, callback: { image in })
    cameraCapture?.start()
  }
}
```

Now it’s time to filter and show the image from the callback. Select and apply any built-in filter. Let’s choose the xRay filter. Do the filtering inside the callback closure. Finally, cameraCapture looks like this:

```swift
cameraCapture = CICameraCapture(cameraPosition: .front, callback: { image in
  guard let image = image else { return }
  let filter = CIFilter.xRay()
  filter.setDefaults()
  filter.inputImage = image
  let uiImage = UIImage(ciImage: (filter.outputImage!.cropped(to: image.extent)))
  self.imageView.image = uiImage
})
```

Let’s run it this way. But what’s that? Nothing appears, and a message is constantly logged to the console.

```text
2022-11-08 15:06:14.829234+0300 RealtimeFiltering[2903:883376] [api] -[CIContext(CIRenderDestination) _startTaskToRender:toDestination:forPrepareRender:forClear:error:] The image extent and destination extent do not intersect.
```

The message is pretty clear. The image extent and destination extent do not intersect. We should define a function to transform and scale the image into the bounds of our view. Create an extension and use this function:

```swift
import CoreImage
extension CIImage {
  func transformToOrigin(withSize size: CGSize) -> CIImage {
    let originX = extent.origin.x
    let originY = extent.origin.y
    let scaleX = size.width / extent.width
    let scaleY = size.height / extent.height
    let scale = max(scaleX, scaleY)
    return transformed(by: CGAffineTransform(translationX: -originX, y: -originY)).transformed(by: CGAffineTransform(scaleX: scale, y: scale))
  }
}
```

Now, let’s use this function to define the uiImage, and bam! We have created a working real-time filtering application.

```swift
let uiImage = UIImage(ciImage: (filter.outputImage!.cropped(to: image.extent).transformToOrigin(withSize: self.view.bounds.size)))
```

Finally, _RealtimeFilterViewController_ should look like this:

*realtimeViewController.swift*

```swift
import UIKit
import CoreImage
import CoreImage.CIFilterBuiltins

class RealtimeFilterViewController: UIViewController {
    var imageView: UIImageView!
    var cameraCapture: CameraCapture?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        imageView = UIImageView(frame: view.bounds)
        view.addSubview(imageView)

        cameraCapture = CameraCapture(callback: { image in
            guard let image = image else { return }
            let filter = CIFilter.xRay()
            filter.setDefaults()
            filter.inputImage = image
            let uiImage = UIImage(ciImage: (filter.outputImage!.cropped(to: image.extent).transformToOrigin(withSize: self.view.bounds.size)))
            self.imageView.image = uiImage
        })
        
        cameraCapture?.start()
    }
}
```

It works perfectly for one simple filter. The output image looks like this:

<figure><img src="/assets/posts/real-time-filtering-with-cifilter/img-2.jpeg" alt="A red patterned rug next to a pale grayscale version of the same rug" loading="lazy"><figcaption>Input Image → Output&nbsp;Image</figcaption></figure>

But what if several filters are used as a chain? Let’s try it. Change the cameraCapture definition like this:

```swift
cameraCapture = CICameraCapture(cameraPosition: .front, callback: { image in
  guard let image = image else { return }
  let filter = CIFilter.thermal()
  let filter2 = CIFilter.xRay()
  let filter3 = CIFilter.motionBlur()
  filter.setDefaults()
  filter2.setDefaults()
  filter3.setDefaults()
  filter.inputImage = image
  filter2.inputImage = filter.outputImage!
  filter3.inputImage = filter2.outputImage!
  let uiImage = UIImage(ciImage: (filter3.outputImage!.cropped(to: image.extent).transformToOrigin(withSize: self.view.bounds.size)))
  self.imageView.image = uiImage
})
```

It still works, but when looking at the resource consumption, it looks like it’s literally draining.

<figure><img src="/assets/posts/real-time-filtering-with-cifilter/img-3.png" alt="CPU, memory and energy usage of the Realtime Filtering app when rendering through a UIImageView" loading="lazy"></figure>

This way is not efficient at all. So, what to do? Fortunately, Apple is aware of this and has provided a more efficient way. It’s MTKView. Create a class named MetalRenderView that inherits MTKView.

*MetalRenderView.swift*

```swift
import MetalKit
import CoreImage

class MetalRenderView: MTKView {
    private lazy var commandQueue: MTLCommandQueue? = {
        return device?.makeCommandQueue()
    }()
    
    private lazy var ciContext: CIContext? = {
        guard let device = device else { return nil }
        return CIContext(mtlDevice: device)
    }()
    
    private var image: CIImage? {
        didSet {
            renderImage()
        }
    }
    
    override init(frame frameRect: CGRect, device: MTLDevice?) {
        super.init(frame: frameRect, device: device)
        
        if super.device == nil {
            fatalError("Metal is not supported by this device")
        }
        framebufferOnly = false
    }
    
    required init(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
        
    func setImage(_ image: CIImage?) {
        guard let image = image else { return }
        self.image = image
    }
    
    private func renderImage() {
        guard let image = image,
              let currentDrawable = currentDrawable,
              let ciContext = ciContext else { return }
        
        let commandBuffer = commandQueue?.makeCommandBuffer()
        let destination = CIRenderDestination(width: Int(drawableSize.width),
                                              height: Int(drawableSize.height),
                                              pixelFormat: .rgba8Unorm,
                                              commandBuffer: commandBuffer) { () -> MTLTexture in
            return currentDrawable.texture
        }
        
        do {
            try ciContext.startTask(toRender: image.transformToOrigin(withSize: drawableSize), to: destination)
        } catch {
            // Error handling
        }
        
        commandBuffer?.present(currentDrawable)
        commandBuffer?.commit()
        draw()
    }
}
```

The application will crash if the device does not support the Metal framework. The most important part of MetalRenderView is the renderImage function. This function is called when the image is assigned and makes the image suitable for MTKView. For more information, Apple’s [document](https://developer.apple.com/documentation/metalkit/mtkview) for MTKView can be used.

Now, let’s show the filtered image with the help of this MetalRenderView. First, let’s replace the imageView in the RealtimeFilterViewController with MetalRenderView.

```swift
var metalView: MetalRenderView!
```

Secondly, replace the following block in viewDidLoad:

```swift
imageView = UIImageView(frame: view.bounds)
view.addSubview(imageView)
```

…with this

```swift
metalView = MetalRenderView(frame: view.bounds, device: MTLCreateSystemDefaultDevice())
view.addSubview(metalView)
```

Then replace these two lines inside the _callback_ closure

```swift
let uiImage = UIImage(ciImage: (filter3.outputImage!.cropped(to: image.extent).transformToOrigin(withSize: self.view.bounds.size)))
self.imageView.image = uiImage
```

with this

```swift
self.metalView.setImage(filter3.outputImage?.cropped(to: image.extent))
```

MetalRenderView handles transformToOrigin method on its own. Now, RealtimeFilterViewController should look like this:

*RealtimeFilterWithMetalViewController.swift*

```swift
import UIKit
import CoreImage
import CoreImage.CIFilterBuiltins

class RealtimeFilterWithMetalViewController: UIViewController {
    var metalView: MetalRenderView!
    var cameraCapture: CameraCapture?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        metalView = MetalRenderView(frame: view.bounds, device: MTLCreateSystemDefaultDevice())
        view.addSubview(metalView)

        cameraCapture = CICameraCapture(cameraPosition: .front, callback: { image in
            guard let image = image else { return }
            let filter = CIFilter.thermal()
            let filter2 = CIFilter.xRay()
            let filter3 = CIFilter.motionBlur()
            filter.setDefaults()
            filter2.setDefaults()
            filter3.setDefaults()
            filter.inputImage = image
            filter2.inputImage = filter.outputImage!
            filter3.inputImage = filter2.outputImage!
            self.metalView.setImage(filter3.outputImage?.cropped(to: image.extent))
        })
        
        cameraCapture?.start()
    }
}
```

Now, let’s run the application again and see the difference. It looks slightly better. But the slight difference will be more valuable when the number of filters increases or when working with more difficult filters.

<figure><img src="/assets/posts/real-time-filtering-with-cifilter/img-4.png" alt="CPU, memory and energy usage of the Realtime Filtering app when rendering through MetalRenderView" loading="lazy"></figure>

Yes, we now have a fully working and more efficient real-time filtering application. The application can be developed with different filters and different UI enhancements. The app may be able to take pictures, but that’s a topic for another article.
