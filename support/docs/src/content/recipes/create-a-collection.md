---
title: Create a collection
category: recipes
related:
  - api/view-types
---

The following examples assume you have [this code defined](#app.md) at the top of your `assemblefile.js`.

## Create a collection

The `.create` method is used to create view collections.

**Example**

The following creates the `pages` view collection:

```js
app.create('pages');
```

### Add templates

Add views (templates) to the `pages` collection:

**Add a single view**

```js
app.page('foo.hbs', { content: 'this is content' });
```

**Add a single view from a filepath**

```js
app.page('templates/pages/foo.hbs');
```

**Add a multiple views**

```js
app.pages({
  foo: { content: 'this is foo' },
  bar: { content: 'this is bar' },
  baz: { content: 'this is baz' }
});
```

**Add a glob of views**

```js
app.pages('templates/*.hbs');
```
