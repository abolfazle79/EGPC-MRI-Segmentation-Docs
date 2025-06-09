---
sidebar_position: 4
title: "Function: postprocess_tumor_segmentation"
---

# Function: `postprocess_tumor_segmentation`

:::info From Raw Clusters to a Refined Mask
This function is the final, critical stage of the segmentation pipeline. Its purpose is to take the raw, noisy segmentation map from the GPC algorithm and apply a series of aggressive, heuristic-based filters. The goal is to eliminate false positives, remove artifacts, and produce a clean, anatomically plausible final tumor mask.
:::

## Function Signature

```python
def postprocess_tumor_segmentation(labels, centroids, image_shape, brain_mask, preprocessed_image):
```

## Parameters

- **`labels`** (`np.ndarray`): A 1D NumPy array containing the raw cluster assignments for each brain pixel, as returned by the GPC function.
- **`centroids`** (`np.ndarray`): A 1D NumPy array containing the final, optimal intensity values for each cluster's center.
- **`image_shape`** (`tuple`): The dimensions (height, width) of the original image, used to reconstruct the full-size mask.
- **`brain_mask`** (`np.ndarray`): The 2D binary (boolean) mask of the brain region, used for distance calculations.
- **`preprocessed_image`** (`np.ndarray`): The 2D preprocessed grayscale image, used for intensity-based filtering.

## Return Values

The function returns a tuple containing two elements:

1.  **`tumor_mask`** (`np.ndarray`): The final, cleaned, 2D binary (boolean) mask representing the detected tumor region.
2.  **`tumor_cluster_id`** (`int`): The integer index of the cluster that was identified as the primary tumor candidate (the one with the highest intensity).

## Core Logic and Filtering Pipeline

The function executes a sequential pipeline of aggressive filters to refine the initial raw mask.

### Stage 1: Initial Mask Generation

- The function first identifies the tumor candidate cluster by finding the cluster with the highest intensity centroid (`np.argmax(centroids)`), as tumors typically appear hyperintense.
- It then reconstructs the initial binary `tumor_mask` by selecting all brain pixels that were assigned to this cluster.

### Stage 2: Aggressive Artifact Filtering

This stage applies a series of non-adaptive, strong filters to clean the mask.

1.  **Edge Zone Filtering:** An `interior_mask` is created by calculating the distance of each pixel from the brain's edge (`ndimage.distance_transform_edt`). Any part of the detected tumor that falls within a 15-pixel-wide "edge zone" is aggressively removed. This is highly effective at eliminating skull-edge artifacts.
2.  **Size Filtering:** `morphology.remove_small_objects` is used with a high threshold (200 pixels) to eliminate any small, noisy detections that are unlikely to be clinically relevant.
3.  **Strong Morphological Opening:** A large opening kernel (`morphology.disk(4)`) is applied to sever any thin, spurious connections between regions and to smooth the shape of the remaining candidates.
4.  **Hole Filling:** `morphology.binary_closing` is used to fill any small, internal holes within the candidate tumor regions.
5.  **Intensity-based Filtering:** A strong intensity filter is applied. It calculates the intensity distribution of the remaining candidate pixels and removes the bottom 30% (`np.percentile(..., 30)`), effectively keeping only the brightest core of the detected regions.
6.  **Dominant Component Selection:** Finally, if multiple disconnected tumor regions remain after filtering, the function checks their relative sizes. If one component is significantly larger (at least 3 times) than the next largest, it is assumed to be the main tumor mass, and all other smaller components are discarded.

This aggressive pipeline ensures that the final `tumor_mask` is very clean, though it carries the risk of being overly conservative and removing parts of the true tumor, which is the trade-off for high precision.
