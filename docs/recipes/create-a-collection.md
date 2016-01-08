# Create a collection

The following examples assume you have the following code at the top of your `assemblefile.js`:

```js
var assemble = require('assemble');
var app = assemble();
```

## Create a collection

The following code creates a basic view collection:

```js
app.create('pages');
```

### Add templates

Add templates to the collection

```js
// add a "page"
app.page('foo.hbs', { content: 'this is content' });

// add multiple "pages"
app.pages('templates/*.hbs');
```

## Related

* [view types](/api/view-types.md)