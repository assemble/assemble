---
title: Features
---

Here are just a few of the features that make {%= name %} powerful and fun to use.

## Base

Assemble is built on [base][].

* If you know how to use [assemble][], [templates][], [update][], [verb][] or any other [base][] application, you will know how to use {%= name %}. The same holds true in reverse.
* Built on [assemble-core][], so all methods from [base][] and [templates][] are exposed on {%= name %}'s API.
* **pipeline plugins**: Supports [gulp][] and [assemble][] plugins

## Plugins

* **plugins**: It's easy to add functionality and features to {%= name %} using via plugins.
* **plugin ecosystem**: {%= name %} is built on [base][], so any plugin from the Base ecosystem can be used, including plugins from [assemble][], [update][], [verb][] and [base][] itself.

## Flow control

### Tasks

* **tasks**: Runs tasks from any generator or sub-generator, programmatically or via CLI. Tasks are powered by some of the same underlying libraries as [gulp][], so if you're familiar with gulp you will know how to create and use tasks with assemble

### Generators

* Generators can extend and use other generators
* **generators**: generators are lazy, so (unless forced) generators are only invoked when they're actually used
* **global generators**: runs globally-installed generators
* **local generators**: runs locally-installed generators
* **{%= configfile %}**: use a local `{%= configfile %}` for generating project-specific files or scaffolds.
* **sub-generators**: Runs sub-generators using simple dot-notation. Supports any level of nesting!

## Templates

* **collections**: first class support for template collections, including pagination, sorting, groups, and more.
* **any engine**: use any template engine to render templates, including [handlebars][], [lodash][], [swig][] and [pug][], and anything supported by [consolidate][]
* **middleware**: Use middleware for transforming files at any point in the [render cycle](render-cycle.md), such as `onLoad`, `preRender`, `postRender`, etc.

## Data

* **data**: easily add data from objects or files for rendering templates
* **data loaders**: create data loaders for adding custom data sources

## Config store

API for persisting configuration settings, global defaults, project-specific defaults, answers to prompts, and so on.

## File system

* **file system**: methods for interacting with the file system
* **vinyl**: views (templates) are [vinyl][] files
* **streams**: full support for [gulp][] and [assemble][] plugins

## Unit tests

* **Easy to test**: testing generators is easy, no special setup or helpers required.
* **Well-tested**: {%= name %} itself is well-tested, with more than 1,200 unit tests.

