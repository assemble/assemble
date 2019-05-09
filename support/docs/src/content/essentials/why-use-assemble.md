---
title: Why use Assemble?
---


* Granular [control over context](docs/why-assemble#context)
* Use [middleware](docs/middleware.md) at any point in the [render cycle](docs/render-cycle.md)
* Flow control using [gulp][]-style [tasks](docs/tasks.md)
* Built with [base][]. Learn assemble and you'll know how to use [verb][], [generate][], [update][] and other [base][] apps.
* [Plugin ecosystem](docs/why-assemble#context)
* Facilitates the use of _modular, encapsulated components_ in your markup, like pages, partials and layouts, resulting in consistent design across your projects.
* Functional, expressive API
* Intuitive CLI, with commands that map elegantly to API methods and conventions



* **chainable**: generators can be chained in the command line or via API. For example, you can install [generate-dest][] then run `$ gen dest` followed by the name of another generator. `generate-dest` will prompt you for the destination directory and store the so the next generator can optionally use it. Or you can extend your own generator with the features and functionality of [generate-dest][].
* **Highly pluggable**: generators can be extended with plugins, other generators, or even sub-generators.
* **composable**: generators can be created from one or more other generators.
* **unparalleled flow control**: by leveraging Generate's unique combination of [generators](docs/generators.md) and [tasks](docs/tasks.md)
* **continuity**: Generators, sub-generators and tasks can be run by command line, API, or both, with a seamless experience between the two.
* **developer friendly API**: generate's API was designed from the ground up with developers in mind. Visit the [getting started guide][getting-started], and within 5 minutes you'll know enough to start using generate.
* **Intuitive CLI**:
* **leverage existing modules**: generators are easy to create, share and publish. Use any javascript or npm package in your generators or plugins. Implementors can use any npm package, and write plugins in pure JavaScript.

## Who should use assemble?

* implementors: use assemble as a node.js library as a part of your own application
* programmers: create and publish generators and plugins
* designers: assemble files (or templates) from templates, scaffolds or boilerplates. Automate the creation of CSS and HTML files, or web components.
