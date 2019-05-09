---
title: How does assemble work?
---

For a detailed introduction for users, we recommend visiting Generate's [Getting Started Guide](https://github.com/assemble).

**Core concepts**

Here are the core concepts:

* Generate is installed globally using npm, which adds the `gen` command to your system path
* Once installed, generate's CLI is used to find and run generators

Generate's API and CLI

* API: Generate itself provides methods for [creating](#creating-generators) and [running](#running-generators) [generators](#generators) and [tasks](#tasks)
* generators: Generators do the "real work".
* plugins
* command line: Generate's CLI focused on [finding](#resolving) locally or globally installed generators

**CLI**

Designed from the ground up to help developers be more productive, Generate is easy to learn, easy to use, and easy to hack on.

## Core concepts

TODO: explain why each is valuable

* Generators: run "generators", which can be thought of as _containers for tasks_. Run a generator using the
* Sub-generators: any generator can _run or be_ a sub-generator.
* Tasks: run [gulp][]-style tasks from command line or API
