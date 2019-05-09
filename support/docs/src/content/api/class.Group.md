---
draft: true

title: Group
category: api
collection: docs
description: > 
  Learn how to create groups with the `Group` class.
---

### Group

Create an instance of `Group` with the given `options`.

**Params**

* `options` **{Object}**

**Example**

```js
var group = new Group({
  'foo': { items: [1,2,3] }
});
```

## Group plugins

It's also possible to use plugins on `group`, using the same conventions and signature as any other [instance plugins]()

```js
var group = new Group();

// set properties on `group`
group.set('one', {contents: new Buffer('aaa')});
group.set('two', {contents: new Buffer('zzz')});

// use plugins
group
  .use(function(group) {
    group.options = {};
  })
  .use(function(group) {
    group.options.foo = 'bar';
  })
  .use(function() {
    this.set('one', 'two');
  });
```
