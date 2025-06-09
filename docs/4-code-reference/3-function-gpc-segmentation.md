---
sidebar_position: 3
title: Function: run_gpc_for_mri_segmentation
---

# Function: `run_gpc_for_mri_segmentation`

:::tip The Optimization Core
This function is the heart of the EGPC framework. It takes the preprocessed brain pixels as input and applies our enhanced, adaptive metaheuristic search to find the optimal cluster centroids that best represent the different tissue types in the image.
:::

## Function Signature

```python
def run_gpc_for_mri_segmentation(image_pixels, n_clusters, max_iter, gpc_params):
```

## Parameters

- **`image_pixels`** (`np.ndarray`): A 1D NumPy array containing the intensity values of only the brain pixels (output from the preprocessing stage).
- **`n_clusters`** (`int`): The number of clusters (`k`) to segment the image into. This is provided by the user.
- **`max_iter`** (`int`): The maximum number of iterations for the GPC algorithm to run. This is also provided by the user.
- **`gpc_params`** (`Structure`): A dictionary-like object containing the core parameters for the GPC algorithm, such as population size (`npop`), gravity (`G`), theta (`Tetha`), etc.

## Return Values

The function returns a tuple containing two elements:

1.  **`final_centroids`** (`np.ndarray`): A 1D NumPy array of size `k` containing the final, optimal intensity values for each cluster's center.
2.  **`labels`** (`np.ndarray`): A 1D NumPy array with the same length as `image_pixels`. Each element contains the integer ID of the cluster to which the corresponding pixel has been assigned.

## Core Logic and Pipeline

The function's logic can be broken down into three major phases:

### 1. Hybrid Initialization

To ensure a robust start and avoid early stagnation, the function does not rely on purely random initialization. It uses a **multi-strategy approach** to populate the initial set of solutions ("workers"). The population is divided into groups, each initialized with a different strategy: random, quantile-based, histogram-peak-based, and a max-distance method inspired by K-Means++. This maximizes initial diversity.

[See the theory behind this...](../3-concepts-and-theory/3-enhanced-gpc-algorithm.md#1-hybrid-multi-strategy-initialization)

### 2. Main Optimization Loop

This is where the iterative search for the best centroids occurs. The loop runs for `max_iter` iterations. Inside this loop, for each "worker" in the population, the following steps are performed:

- **Adaptive Parameter Calculation:** The substitution probability (`pSS`) is dynamically calculated for each iteration to balance exploration and exploitation.
- **GPC Movement:** The core GPC physics-based equations are used to calculate a new candidate position (a new set of centroids) based on the worker's current position, a random velocity, and random friction.
- **Stagnation-Aware Acceptance:** This is a critical enhancement. The algorithm tracks if the global best solution has improved recently.
  - If a new solution is better, it is always accepted.
  - If the search is stagnating, the algorithm has a small, decreasing probability of accepting a **worse** solution. This allows it to "jump" out of local optima. The probability is calculated using a Simulated Annealing-like formula:
    $$
    P(\text{accept}) = e^{-\frac{\Delta C}{T}}
    $$
  - As a final failsafe, if an agent is stuck for many iterations, it may be **randomly restarted** to a new position in the search space.

[See the theory behind these enhancements...](../3-concepts-and-theory/3-enhanced-gpc-algorithm.md#3-stagnation-aware-escape-mechanisms)

### 3. Final Label Assignment

After the optimization loop completes, the function takes the best set of centroids found (`pharaohs_agent.position`) and performs a final assignment. It calculates the distance of every brain pixel to each of the final centroids and assigns each pixel to the cluster of its nearest centroid. This generates the final `labels` array that is returned.
