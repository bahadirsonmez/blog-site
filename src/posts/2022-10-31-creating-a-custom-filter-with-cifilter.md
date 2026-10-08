---
title: "Creating a custom filter with CIFilter"
description: "How to build a custom CIFilter with the Metal kernel language, using a bilateral filter as the example."
date: 2022-10-31
tags: [apple-dev, ios-app-development, cifilter, custom-filter, apple, swift]
status: ready
medium_url: https://medium.com/@sonmezbahad/creating-a-custom-filter-with-cifilter-3e5a6445ec15
---
CIFilter is one of the many great features that Apple has given us. There are already filters prepared by Apple that are very easy to use. We can access them with ‘import CIImage.CIFilterBuiltins’. But what if the filter we’re looking for isn’t among them? In such cases, it is possible to create customized filters using the Kernel language. So how? In this article, I will talk about how we can achieve this.

## Creating the kernel

Now let’s see how we can use the [Bilateral Filter](https://en.wikipedia.org/wiki/Bilateral_filter). First, we need to create a ‘*metal*’ file. Let’s name this file ‘FilterKernels’. Let’s replace the contents of the file with the following.

*filterkernels.metal*

```cpp
#include <metal_stdlib>
using namespace metal;

#include <CoreImage/CoreImage.h>

extern "C" {
  namespace coreimage {

  }
}
```

First, we need to understand how the filter works. As written on the Wikipedia page, the filter takes four inputs and gives output due to some calculations. Our first input is the input image, the second input is the radius, the third input is spatial sigma, and the fourth is the sigma range. In this case, our output is the filtered image. When we translate the function on the Wikipedia page into kernel language, we encounter a function like this:

*bilateralFilter.metal*

```cpp
float4 bilateralFilterKernel(sampler image, float radiusF, float sigmaS, float sigmaR) {
  float4 input = image.sample(image.coord());
  float3 premultipliedRunningSum = 0;
  float weightRunningSum = 0;
  int radius = int(radiusF);
  
  for (int i = -radius; i <= radius; i++) {
    for (int j = -radius; j <= radius; j++) {
      float4 referenceInput = image.sample(image.coord() + float2(i, j) / image.size());
      float weight = exp ( - (i * i + j * j) / (2 * sigmaS * sigmaS)
                           - pow((input.r - referenceInput.r), 2.0) / (2 * sigmaR * sigmaR));
      weightRunningSum += weight;
      premultipliedRunningSum += weight * referenceInput.rgb;
    }
  }
  return float4(premultipliedRunningSum / weightRunningSum, input.a);
}
```

When we take this code into the namespace coreimage, the Kernel side is completed without any problems. Now it’s time for how to use it. In the last case, the Bilateral Filter Kernel file looks like this:

*filterkernels.metal*

```cpp
#include <metal_stdlib>
using namespace metal;

#include <CoreImage/CoreImage.h>

extern "C" {
  namespace coreimage {
    float4 bilateralFilterKernel(sampler image, float radiusF, float sigmaS, float sigmaR) {
      float4 input = image.sample(image.coord());
      float3 premultipliedRunningSum = 0;
      float weightRunningSum = 0;
      int radius = int(radiusF);
      
      for (int i = -radius; i <= radius; i++) {
        for (int j = -radius; j <= radius; j++) {
          float4 referenceInput = image.sample(image.coord() + float2(i, j) / image.size());
          float weight = exp ( - (i * i + j * j) / (2 * sigmaS * sigmaS)
                               - pow((input.r - referenceInput.r), 2.0) / (2 * sigmaR * sigmaR));
          weightRunningSum += weight;
          premultipliedRunningSum += weight * referenceInput.rgb;
        }
      }
      return float4(premultipliedRunningSum / weightRunningSum, input.a);
    }
  }
}
```

## Creating the filter

In order to use the filter we have created with the CIFilter infrastructure, we need to create its own class of filter. First, we create the BilateralFilter class that inherits from CIFilter. We define the kernel function we will use with a lazy variable. Then we define the inputs that the filter will use. Finally, we override the _outputImage_ variable in CIFilter and return the result of our own function. In the last case, the BilaterFilter class takes the following form.

*bilateralFilterClass.swift*

```swift
import CoreImage

class BilateralFilter: CIFilter {
  private lazy var kernel: CIKernel = {
    guard
      let url = Bundle.main.url(forResource: "default", withExtension: "metallib"),
      let data = try? Data(contentsOf: url) else {
        // Error handling
    }
    
    guard let kernel = try? CIKernel(functionName: "bilateralFilterKernel", fromMetalLibraryData: data) else {
        // Error handling
    }
    
    return kernel
  }()
  
  var inputImage: CIImage?
  var radius: Float = 13
  var spatial: Float = 15
  var range: Float = 0.1
  
  override var outputImage: CIImage? {
    guard let inputImage = inputImage else { return .none }
    
    return kernel.apply(extent: inputImage.extent,
                        roiCallback: { (index, rect) -> CGRect in
                          let out = rect.insetBy(dx: CGFloat(-self.radius), dy: CGFloat(-self.radius)).intersection(inputImage.extent)
                          return out
    },
                        arguments: [inputImage, radius, spatial, range])
  }
}
```

## Using the filter

The filter we created can now be used like other CIFilter filters. When we use the following configuration as an example,

```swift
let filter = BilateralFilter()
filter.inputImage = anImage
filter.radius = 13.0
filter.spatial = 15.0
filter.range = 0.1
filter.outputImage!
```

We get a result like this:

<figure><img src="/assets/posts/creating-a-custom-filter-with-cifilter/img-1.jpeg" alt="A mountain peak photo: the original above and the same photo smoothed by the bilateral filter below" loading="lazy"></figure>
