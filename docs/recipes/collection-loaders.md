# Loading views for a collection

Assemble offers multiple options for adding views to a collection. This recipe focused on adding views using glob patterns, which is made possible by the (included) [assemble-loader](https://github.com/assemble/assemble-loader) plugin.

**First, create a collection**

If you don't already have a collection you'd like to use, let's create one.

```js
var assemble = require('assemble');
var app = assemble();

// create a "pages" collection
app.create('pages');
```

**Load "pages"**

Now we can load views onto the pages collection. Views are stored on `app.views.*`, so here our views will be stored on `app.views.pages`.

```js
app.pages('foo/*.hbs');
console.log(app.views.pages);
```
