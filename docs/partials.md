# Partials

> How to register and use partials with Assemble

## What is a partial?

The term partial comes from "partial template". Partials are ideal for creating reusable user interface components, like buttons, navbars, modals, etc. 

Partials aren't limited to UI components, they can be used for any kind of document fragments, snippets of content, or HTML. 

## Overview

Working with partials in Assemble:

- If pre-loaded, partials are stored as objects on the `assemble.views.partials` object. All templates follow this convention.
- If not pre-loaded, at render time partials are passed directly to the template engine following the conventions of the engine. See [engine difference].


## Engine differences

Support for partials varies from one template engine to another. Assemble uses the same conventions as [consolidate.js] to provides a consistent, normalized interface to these engines.


For example, Handlebars has first class support for partials, so partials are loaded onto the `handlebars.partials` object. Lo-Dash has no concept of partials, so partials are resolved the same way any other variable on the context is resolved, thus partials are passed as properties on the context.


[consolidate.js]: https://github.com/tj/consolidate.js
