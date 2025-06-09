---
sidebar_position: 1
title: Code Overview
---

# Code Structure Overview

:::note From Theory to Practice
This section provides a technical breakdown of the `final.py` script, bridging the gap between the [concepts discussed previously](../3-concepts-and-theory/1-base-gpc-algorithm.md) and their actual implementation. This overview serves as a high-level map of the code architecture before we dive into each function in detail.
:::

The entire process is orchestrated from the `if __name__ == "__main__"` block at the end of the script, which executes a modular pipeline.

## The Execution Pipeline

The script follows a clear, sequential pipeline:

1.  **Configuration:** The `main` block starts by setting up configurations, including file paths, the `RANDOM_SEED` for reproducibility, and GPC parameters. It also handles user input for key parameters.
2.  **Preprocessing:** It calls the `preprocess_mri_image()` function to load the raw MRI scan, clean it, remove artifacts, and generate a precise brain mask.
3.  **Optimization Core:** The cleaned data (`brain_pixels`) is then passed to the `run_gpc_for_mri_segmentation()` function to find the optimal cluster centroids.
4.  **Refinement:** The raw segmentation labels are passed to the `postprocess_tumor_segmentation()` function, which uses intelligent filters to clean the result.
5.  **Visualization & Saving:** Finally, `visualize_results()` and `save_tumor_mask()` are called to display and save the outputs.

## Key Functions Breakdown

The script is organized into several distinct parts, each responsible for a specific stage of the pipeline.

### Part 1: `Structure` Helper Class

A small utility class that allows for cleaner, attribute-style access to dictionary keys, making the code more readable.

### Part 2: `preprocess_mri_image()`

This is one of the most critical functions, responsible for preparing the raw image for segmentation. Its goal is to produce a clean `brain_mask` and a noise-free image array.

[See the detailed breakdown of this function...](./2-function-preprocess.md)

### Part 3: `run_gpc_for_mri_segmentation()`

This function contains the core logic of our **Enhanced GPC (EGPC)** algorithm, including smart initialization, adaptive operators, and stagnation-aware escape mechanisms.

[See the detailed breakdown of this function...](./3-function-gpc-segmentation.md)

### Part 4: `postprocess_tumor_segmentation()`

This function takes the raw cluster labels and applies a series of intelligent, adaptive filters to produce the final, clean tumor mask.

[See the detailed breakdown of this function...](./4-function-postprocess.md)

### Part 5: Visualization and Saving Functions

These are utility functions (`visualize_results` and `save_tumor_mask`) responsible for generating the final visual outputs.

### Part 6: Main Execution Block

The `if __name__ == "__main__"` block orchestrates the entire process, calling the functions above in the correct sequence.
