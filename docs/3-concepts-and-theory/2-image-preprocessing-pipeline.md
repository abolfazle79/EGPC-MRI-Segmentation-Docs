---
sidebar_position: 2
title: Image Preprocessing Pipeline
---

# Image Preprocessing Pipeline

:::tip The Importance of Clean Data
The accuracy of any segmentation algorithm is highly dependent on the quality of the input data. Raw MRI scans often contain noise, imaging artifacts, and non-brain tissues like the skull and fat. This page details the comprehensive, multi-stage pipeline we designed to clean the raw image and generate a highly accurate brain mask, ensuring our [Enhanced GPC Algorithm](./3-enhanced-gpc-algorithm.md) operates only on relevant data.
:::

Our preprocessing workflow, implemented in the `preprocess_mri_image` function, can be broken down into the following key stages.

## Step 1: Image Loading and Normalization

The process begins by loading the input image, which is expected to be in a format like TIFF. It is immediately converted to grayscale (`'L'` mode) to work with single-channel intensity values.

```python
original_image = Image.open(image_path)
if original_image.mode != 'L':
    original_image = original_image.convert('L')
```

The pixel values, which are typically in the range `[0, 255]`, are then normalized to a floating-point range of `[0.0, 1.0]`. This is a standard practice that makes subsequent mathematical operations more stable.

```python
image_array = np.array(original_image, dtype=np.float64) / 255.0
```

## Step 2: Noise Reduction and Contrast Enhancement

To improve image quality, two standard enhancement techniques are applied:

1.  **Gaussian Blur:** A Gaussian filter is applied to reduce random imaging noise, which can create false edges or textures. The `gaussian_sigma` parameter controls the strength of this filter.
2.  **Contrast Limited Adaptive Histogram Equalization (CLAHE):** Unlike global histogram equalization, CLAHE improves contrast locally. This is highly effective for MRI scans as it enhances the subtle boundaries between different soft tissues (e.g., gray matter, white matter, and tumorous tissue) without over-amplifying noise.

```python
# In preprocess_mri_image()
image_pil = Image.fromarray((image_array * 255).astype(np.uint8))
image_pil = image_pil.filter(ImageFilter.GaussianBlur(radius=gaussian_sigma))
image_array = np.array(image_pil, dtype=np.float64) / 255.0

image_array = exposure.equalize_adapthist(image_array, clip_limit=0.03)
```

## Step 3: Initial Brain Masking (Skull Stripping)

The first step in isolating the brain is to apply a simple intensity-based threshold to create an initial binary mask. This mask roughly separates the brain and skull from the dark background.

```python
brain_mask = image_array > skull_strip_threshold
```

This initial mask is often imperfect and contains noise and parts of the skull. The subsequent steps are dedicated to refining it.

## Step 4: Advanced Artifact and Skull Remnant Removal

This is the core of our preprocessing innovation. A series of morphological and analytical steps are taken to create a clean and precise brain mask.

1.  **Remove Small Objects:** `morphology.remove_small_objects` eliminates small, disconnected white patches outside the main brain region, which are typically noise.
2.  **Fill Holes:** `ndimage.binary_fill_holes` fills any black holes that may exist inside the brain region.
3.  **Erosion:** `morphology.binary_erosion` is applied to shrink the mask's boundaries. This is a crucial step to "detach" the brain mask from any connected skull fragments. The `erosion_iterations` parameter controls how aggressively this is done.
4.  **Distance-based Skull Filtering:** A sophisticated filter is applied to remove bright skull remnants near the brain's edge. It calculates the distance of each pixel from the brain's boundary and applies a higher intensity threshold to pixels in this "near-edge" zone, effectively removing them.
5.  **Opening:** `morphology.binary_opening` is used to remove thin connections and further clean the mask shape.
6.  **Keep Largest Component:** `morphology.label` assigns a unique ID to each disconnected region. The code then identifies the largest region (the brain) and discards all others.
7.  **Dilation:** A final, slight `morphology.binary_dilation` is performed to recover a small amount of brain tissue that might have been lost during the aggressive erosion step.

The result of this pipeline is a highly accurate `brain_mask_final` that precisely delineates only the brain tissue.

## Step 5: Final Masking

Finally, the cleaned mask is applied to the preprocessed image, setting all non-brain pixels to zero.

```python
image_array = image_array * brain_mask_final
```

The function returns this `image_array` and the final `brain_mask`, which are then used as inputs for the GPC optimization and post-processing stages.
