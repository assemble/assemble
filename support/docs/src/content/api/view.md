---
title: view
---


Views are [vinyl files](https://github.com/gulpjs/vinyl) that have been loaded by assemble, either using a collection method, like `app.src()` or `app.pages()`, or using `app.view()`.

Additionally:

- when a [collection loader method]() is used, views are cached on an assemble collection

Views are still vinyl files, but they are also

Once loaded by assemble, views are still vinyl files, but they are also cached on an assemble template collection,

A `view` is a "template object", with properties like `path` and `contents`.  Additionally, views are instances of [vinyl][] files, with the addition of a few special properties to make middleware handling and rendering easier.

[1]: such as `pages`, they're decorated with a of couple additional properties, like pagination information, `file.data` (which is used for storing the data from yaml front-matter) and they can be found using "lookup" methods like `app.pages.getView()` etc.).

but they are also cached on an assemble template collection, such as `pages`, they're decorated with a of couple additional properties, like pagination information, `file.data` (which is used for storing the data from yaml front-matter) and they can be found using "lookup" methods like `app.pages.getView()` etc.).



with the addition of a few special properties to make middleware handling and rendering easier

