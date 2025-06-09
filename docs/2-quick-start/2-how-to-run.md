---
sidebar_position: 2
title: How to Run the Code
---

# How to Run the Code

:::info Prerequisite
Before proceeding, please ensure you have completed all the steps in the [Prerequisites & Installation](./1-prerequisites-and-installation.md) guide, including installing dependencies and preparing the input image.
:::

Running the segmentation framework is straightforward. The script is designed to be executed from the command line and will interactively prompt you for key parameters.

## Step 1: Execute the Script

1.  Open a terminal or command prompt.
2.  Navigate to the root directory of the project (where the `final.py` script is located).
3.  Run the following command:

    ```bash
    python final.py
    ```

## Step 2: Provide Input Parameters

After executing the script, it will guide you through a series of prompts. You can either enter a new value or simply press `Enter` to accept the default value shown in the brackets `[]`.

### Prompt 1: Number of Iterations

This prompt sets the `max_iter` for the GPC optimization algorithm. A higher number allows the algorithm more time to find a better solution but increases the total runtime.

```text
Enter number of iterations (e.g., 100):
```

A value between 100-200 is generally a good starting point for complex images.

### Prompt 2: Number of Clusters (`k`)

This prompt defines how many distinct tissue types the algorithm should attempt to identify in the image.

```text
Enter number of clusters (e.g., 3):
```

For brain tumor segmentation, a value of `k=3` (e.g., for tumor, edema, and healthy tissue) or `k=4` is typically effective.

### Prompt 3: Erosion Iterations

This parameter controls the strength of the skull-stripping filter in the preprocessing stage.

```text
Enter erosion iterations (e.g., 5):
```

A larger number removes a thicker layer from the brain mask's edge, which is more effective at removing skull artifacts but carries a slight risk of removing peripheral brain tissue. A value between 3 and 5 is usually recommended.

---

After you provide these three inputs, the script will automatically run the entire pipeline, display the optimization progress in the terminal, and show the final visualization.

**Next Step:** [Understanding the Outputs](./3-understanding-outputs.md)
