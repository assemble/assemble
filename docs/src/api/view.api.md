---
title: View API
---

## View constructor

Create an instance of `View`, optionally passing a default object to instantiate with.

**Params**

* `view` **{Object}**

**Example**

```js
var view = new View({
  path: 'foo.html',
  content: 'this is content...'
});
```

## View methods

### .context

Creates a context object from front-matter data, `view.locals` and the given `locals` object.

**Params**

* `locals` **{Object}**: Optionally pass locals to the engine.
* `returns` **{Object}**: Returns the context object.

**Example**

```js
var ctx = page.context({foo: 'bar'});
```

### .compile

Synchronously compile a view.

**Params**

* `locals` **{Object}**: Optionally pass locals to the engine.
* `returns` **{Object}** `View`: instance, for chaining.

**Example**

```js
var view = page.compile();
view.fn({title: 'A'});
view.fn({title: 'B'});
view.fn({title: 'C'});
```

### .render

Asynchronously render a view.

**Params**

* `locals` **{Object}**: Optionally pass locals to the engine.
* `returns` **{Object}** `View`: instance, for chaining.

**Example**

```js
view.render({title: 'Home'}, function(err, res) {
  //=> view object with rendered `content`
});
```

### .isType

Return true if the view is the given view `type`. Since types are assigned by collections, views that are "collection-less" will not have a type, and thus will always return `false` (as expected).

**Params**

* `type` **{String}**: (`renderable`, `partial`, `layout`)

**Example**

```js
view.isType('partial');
```

## Related

* [view](/api/view.md)