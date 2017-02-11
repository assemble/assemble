---
title: Terminology
collection: docs
category: api
---

## views, files and templates

Throughout the documentation, you will see references to "files", "views", "templates", "items" and "pages". Here is how they differ:

| **name** | **description** |
| --- | --- |
| `file` | a [vinyl file](https://github.com/gulpjs/vinyl). Assemble supports any [gulp][] plugin. When we use the term `file`, we are generally referring to a file in a vinyl pipeline, like in plugin documentation for example. |
| `view` | a [vinyl file](https://github.com/gulpjs/vinyl) that has been loaded by assemble, either onto a collection using a method like `app.src()` or `app.pages()`, or using [app.view()](api/app.view.md). Learn more [about views](api/view.md) |


| **name** | **description** |
| --- | --- |
| `page` | a view from the `pages` collection |
| `partial` | a view from the `partials` collection |
| `layout` | a view from the `layouts` collection |




## Middleware

TODO

## Pipeline

TODO

## Plugins

TODO

## Stream

TODO

## Context

TODO
