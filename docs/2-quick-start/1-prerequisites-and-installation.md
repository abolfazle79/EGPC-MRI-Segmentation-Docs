---
sidebar_position: 1
title: Prerequisites & Installation
---

# Prerequisites & Installation

:::tip Before You Begin
This guide provides all the necessary steps to set up your environment to run the EGPC segmentation framework. Follow these steps to ensure all dependencies are correctly installed.
:::

## 1. System Requirements

- **Python:** Python 3.8 or higher is recommended. You can download it from [python.org](https://python.org/).
- **pip:** A package installer for Python, which is usually included with your Python installation.

## 2. Obtaining the Source Code

The source code for this research project is not publicly available at this time. To obtain a copy for academic or research purposes, please send a formal request via email.

:::info Requesting Access
Please send an email to the following address with a clear subject line.

- **Recipient:** `your-academic-email@example.com`
- **Subject:** `Source Code Request: Enhanced GPC Project`

In the body of your email, please briefly introduce yourself, state your **name**, **affiliation** (university or institution), and the **purpose** for which you intend to use the code (e.g., replication, comparative study, academic research). We will respond to valid requests as soon as possible.
:::

After receiving the code, you can proceed to the next step.

## 3. Installing Dependencies

Our project relies on several powerful Python libraries for scientific computing and image processing. The easiest way to install them is by using the provided `requirements.txt` file.

**Step 3.1: Create `requirements.txt`**

Create a file named `requirements.txt` in the root directory of your project and paste the following content into it:

```text
numpy
Pillow
matplotlib
scipy
scikit-image
```

**Step 3.2: Install from `requirements.txt`**

Now, run the following command in your terminal. This will automatically read the file and install all the listed libraries.

```bash
pip install -r requirements.txt
```

This single command ensures that you have all the necessary dependencies with compatible versions.

## 4. Preparing the Input Image

The script is configured to read an image from a specific path.

1.  Create a folder named `input_image` in the root directory of the project.
2.  Place your MRI scan (e.g., in `.tif` format) inside this folder.
3.  Open the `final.py` script and make sure the `IMAGE_PATH` variable points to your image file. For example:
    ```python
    # In final.py
    IMAGE_PATH = 'input_image/TCGA_DU_7014_19860618_46.tif'
    ```

## You're All Set!

Your environment is now fully configured. In the next section, we will run the script and see it in action.

**Next Step:** [How to Run the Code](./2-how-to-run.md)
