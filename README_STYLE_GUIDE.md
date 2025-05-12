# README Style Guide

This document outlines the standard structure and content for README files within this monorepo. Adhering to this guide will ensure consistency and clarity across all packages.

## Core Principles

1.  **Clarity of Purpose**: Every README should begin by clearly stating why the module or package exists. What problem does it solve? What is its primary function?
2.  **Problem/Solution Focused**: Explain the specific challenge or need the module addresses and how it provides a solution.
3.  **Highlight Key Benefits**: Emphasize the advantages of using the module, such as improved performance, simplified APIs, unified approaches to common problems, etc.
4.  **Concise Overviews**: Provide high-level overviews of the module's functionalities. Avoid getting bogged down in excessive detail that is better suited for API documentation.
5.  **Logical Grouping**: When discussing multiple functions, classes, or components, group them logically to make them easier to understand.
6.  **Refer to Source Documentation**: TypeScript typings and JSDoc comments are the primary source of truth for detailed API specifications. READMEs should guide users to these resources rather than attempting to duplicate them.

## README Structure

A typical README should follow this general structure:

### 1. Package Name and Introduction

- Start with the package name (e.g., `# @art-suite/my-package`).
- Immediately follow with a concise (1-2 sentence) explanation of the module's core purpose.

### 2. "Why This Module?" Section

**Start with Why (Simon Sinek Method) - The Hook**. Answer these three questions, in this order:

- **Why**: Succinctly identify the core problem or developer pain point this module directly addresses. Why would a developer need this?
- **How**: Briefly outline the module's strategic approach to solving that problem. How does it uniquely or effectively provide a solution?
- **What**: Clearly state what the module delivers. What is the tangible tool or functionality (e.g., "a comprehensive set of `isFoo` type-checking functions")?

You don't need to explicitly label the "why, how and what" - it should be obvious. Be brief and compelling. The goal of this section is to convince the developer to read in more detail, not to provide the details themselves.

### 3. Example Installation and Use (Required)

- Briefly show how to install before the examples
- Provide one or two concise, compelling code examples that demonstrate actual usage of the module in a real-world context.
- Examples should make it immediately clear how to use the library and what value it provides.
- Keep examples focused and easy to understand; avoid unnecessary complexity.

### 4. Functional Overview

- Describe the main features or groups of functions/components.
- **Group Logically**: Cluster related functionalities together (e.g., "Type Checking Functions," "Utility Components").
- **Usage Overview**: For each group, provide a brief explanation of how to use them. Focus on common use cases or important concepts.
- **Keep it High-Level**: Do not attempt to document every single function, parameter, or option in exhaustive detail. The goal is to give the user a good understanding of what the module offers and how to generally approach using it.

### 5. API Documentation Reference

- Include a brief section that directs users to the formal API documentation.
- Example: "For detailed information on all exported functions and their parameters, please refer to the TypeScript typings and JSDoc comments within the source code."

## Tone and Style

- Write clearly and concisely.
- Use consistent terminology.
- Focus on the user's perspective: What do they need to know to use this module effectively?
