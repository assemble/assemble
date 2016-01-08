# Loading views for a collection

Assemble offers multiple options for adding views to a collection. This recipe focused on adding views using glob patterns, which is made possible by the [assemble-loader](https://github.com/assemble/assemble-loader) plugin, which is included by default with assemble.

**Create a collection**

If you don't already have a collection you'd like to use, let's create one first.

```js
var assemble = require('assemble');
var app = assemble();

// create a "pages" collection
app.create('pages');
```

**Load "pages"**

Now we can load views onto the pages collection. Views are stored on `app.views.*`, so our `pages` will be stored on `app.views.pages`.

```js
app.pages('foo/*.hbs');
console.log(app.views.pages);
```

**That's it!**

* create a collection
* load views
* done!

## Related

- [create a collection](./create-a-collection.md)
- [rendering templates](./rendering-templates.md)