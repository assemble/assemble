---
title: File system API
collection: docs
category: api
---

Whether you prefer (or require) a declarative [grunt][]-style approach, or an imperitive [gulp][]-style approach, Assemble offers methods for working with the file system that should satisfy either preference.

## Overview

**Low-level**

Read and write files.

- .src
- .dest
- .copy

**Flow control**

- .each
- .eachSeries

**High-level**

Combines the low-level methods and flow-control methods, with support for declarative configurations, to simplify automation of common tasks.

- .process
- .scaffold
- .boilerplate

## Comparison table

| **Method** | **Description** |
| --- | --- |
|.src | Read a glob of files from the file system |
|.dest | Write files to the given `dest` path |
|.copy | Copy a glob of files to the given `dest` path |
|.each | Asynchronously loop over `src`/`dest` files definitions in parallel |
|.eachSeries | Asynchronously loop over `src`/`dest` files definitions in series |
|.process | Expands on `copy` with plugin/pipeline handling |
|.scaffold | Calls `each` on `process` |
|.boilerplate | Call `each` on `scaffold` |
