---
sidebar_position: 3
title: Understanding the Outputs
---

# Understanding the Outputs

:::info From Data to Diagnosis
After the script successfully completes, it generates two primary image files in your project's output directory. This page explains what each of these outputs represents and how to interpret them.
:::

## 1. The Tumor Mask (`tumor_mask.png`)

This is the core quantitative output of the segmentation process.

- **Content:** It is a binary (black and white) image of the same dimensions as the original MRI scan.
- **Interpretation:**
  - **White Pixels:** Represent the area that the EGPC framework has identified as the tumor region.
  - **Black Pixels:** Represent all other areas (healthy brain tissue and background).
- **Usage:** This mask is crucial for further analysis. It can be used to calculate the exact volume of the tumor, monitor its growth over time, or be fed into radiation therapy planning software.

![Example of a generated tumor mask](/img/tumor_mask.png)
_(Please place an actual output mask from your script in `static/img` and update this path if needed)_

## 2. The Visualization Plot (`segmentation_visualization.png`)

This is the qualitative output designed for human interpretation and verification. It provides a comprehensive visual summary of the entire process in a single image.

- **Content:** It is a multi-panel plot containing **three** different views.
- **Interpretation:**
  - **Panel 1: Original MRI Scan:** The raw input image is shown for baseline comparison.
  - **Panel 2: Preprocessed MRI (Enhanced):** This panel displays the result of the [advanced preprocessing pipeline](../3-concepts-and-theory/2-image-preprocessing-pipeline.md). It effectively demonstrates the removal of the skull and other artifacts, showing the clean data that was fed into the optimization algorithm.
  - **Panel 3: Enhanced Tumor Detection (Overlay):** This provides the most intuitive result. It overlays the final, cleaned tumor mask with a semi-transparent red color on the original grayscale image. This visualization makes the exact size, shape, and location of the detected tumor immediately clear and easy to interpret.

This visualization is ideal for presentations, reports, and for quickly verifying if the segmentation result is clinically plausible.

---

**Next Step:** With the quick start guide complete, we can now move on to the [detailed theoretical concepts](../3-concepts-and-theory/1-base-gpc-algorithm.md) behind our framework.
