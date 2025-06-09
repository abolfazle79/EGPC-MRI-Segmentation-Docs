---
sidebar_position: 2
title: Function: preprocess_mri_image
---

# Function: `preprocess_mri_image`

:::info Function Goal
This function serves as the critical first stage of the EGPC pipeline. Its purpose is to take a raw MRI image path as input and produce a clean, normalized image array and a highly accurate binary brain mask. This version implements a more aggressive filtering strategy to robustly handle artifacts.
:::

## Function Signature

```python
def preprocess_mri_image(image_path, skull_strip_threshold=0.1, gaussian_sigma=1.0,
                        enhance_contrast=True, erosion_iterations=5):
```

## Parameters

- **`image_path`** (`str`): The file path to the input MRI scan (e.g., a `.tif` file).
- **`skull_strip_threshold`** (`float`, optional): The initial intensity threshold for separating the brain from the background. Defaults to `0.1`.
- **`gaussian_sigma`** (`float`, optional): The standard deviation for the Gaussian blur filter used for noise reduction. Defaults to `1.0`.
- **`enhance_contrast`** (`bool`, optional): A flag to enable or disable contrast enhancement using CLAHE. Defaults to `True`.
- **`erosion_iterations`** (`int`, optional): A user-defined value that controls the base strength of the morphological erosion filter. Defaults to `5`.

## Return Values

The function returns a tuple containing three elements:

1.  **`image_array`** (`np.ndarray`): A 2D NumPy array representing the final preprocessed image. In this array, all non-brain regions have been masked (set to zero), and the image has been normalized and contrast-enhanced.
2.  **`original_image`** (`PIL.Image`): The original image loaded from the file path, preserved in its initial state for visualization purposes.
3.  **`brain_mask_final`** (`np.ndarray`): A 2D binary (boolean) NumPy array of the same dimensions as the original image. Pixels with a value of `True` belong to the final, cleaned brain region.

## Core Logic and Pipeline

The function executes a sequential pipeline designed for robust artifact removal.

### Stage 1: Loading and Initial Enhancement

- The image is loaded, converted to grayscale (`'L'` mode), and its pixel values are normalized to a `[0.0, 1.0]` floating-point range.
- If `gaussian_sigma > 0`, a Gaussian blur is applied to reduce noise.
- If `enhance_contrast` is `True`, Contrast Limited Adaptive Histogram Equalization (CLAHE) is used to improve local contrast, making tissue boundaries more distinct.

### Stage 2: Advanced Brain Extraction and Skull Stripping

This stage creates a highly accurate brain mask through a series of aggressive filtering steps:

1.  **Initial Masking:** A primary `brain_mask` is created using `skull_strip_threshold`. Small noisy components are removed using `morphology.remove_small_objects`, and any holes within the mask are filled with `ndimage.binary_fill_holes`.
2.  **Aggressive Erosion:** To detach the brain mask from the skull, a strong erosion is applied. The kernel size is dynamically set to `erosion_iterations + 2` to ensure a clean separation.
3.  **Distance-based Skull Remnant Filtering:** This is a key step.
    - It calculates the distance of each pixel from the brain's edge using `ndimage.distance_transform_edt`.
    - It defines a "near-edge" zone with a hardcoded `edge_threshold` of 20 pixels.
    - It applies a stricter intensity threshold (`skull_strip_threshold + 0.2`) only to this near-edge zone, effectively removing bright skull fragments that often cling to the brain boundary.
4.  **Strong Morphological Opening:** A large opening kernel (`morphology.disk(4)`) is used to sever any thin, spurious connections and further smooth the mask's shape.
5.  **Component Filtering:** `morphology.label` is used to find all disconnected regions, and only the single largest component (the main brain area) is retained.
6.  **Final Cleanup:** A final, gentle dilation (`recovery_kernel`) is applied to reclaim a small amount of tissue lost during erosion, followed by a `binary_closing` to smooth the final mask.

### Stage 3: Final Mask Application

The resulting `brain_mask_final` is multiplied with the enhanced image array to produce the final preprocessed output, where all non-brain information has been removed.
