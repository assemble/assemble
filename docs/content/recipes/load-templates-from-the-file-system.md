---
title: Loading views for a collection
category: recipes
related:
  - create-a-collection
  - rendering-templates
---

Assemble offers multiple options for adding views to a collection. This recipe shows how to load templates from the file system using glob patterns.

**Create a collection**

If you don't already have a collection you'd like to use, let's create one first.

```js
var assemble = require('assemble');
var app = assemble();

app.create('pages');
```

The `.create` method created a `pages` collection for us, now we can load pages (views) onto the collection.

Learn more about [creating collections](/recipes/create-a-collection.md)

**Load "pages"**

Views are stored on `app.views.COLLECTION_NAME_HERE`, which means that, thanks to the `.create` method, our `pages` will be stored on `app.views.pages`. Also thanks to the `.create` method, we can now use the `.pages()` method to load views onto that object.

For example:

```js
app.pages(['foo/*.hbs', 'bar/*.hbs']);
console.log(app.views.pages);
```

## Custom loading

Assemble uses the [assemble-loader][] plugin to enable some of the features show in this recipe. If you require different behavior, feel free to fork [assemble-loader][] or just use it as a reference to create your own custom plugin.

[assemble-loader]: https://github.com/assemble/assemble-loader
