---
title: Route
collection: docs
category: api
---

### .route

Proxy to `Router#route()`, returns a new `Route` instance for the given `path`. Routes are isolated middleware stacks for specific paths.

### .param

Proxy to `Router#param()` with one added API feature: The `name` parameter can be an array of names.

* `name` **{String|Array}**
* `fn` **{Function}**
* `returns` **{Object}** Returns the instance of `assemble` for chaining


### Routes and middleware

### .handle

Handle a middleware `method` for `view`.

**Params**

* `method` **{String}**: Name of the router method to handle. See [router methods](./docs/router.md)
* `view` **{Object}**: View object
* `callback` **{Function}**: Callback function
* `returns` **{Object}**

**Example**

```js
app.handle('customMethod', view, callback);
```

### .route

Create a new Route for the given path. Each route contains a separate middleware stack.

See the [route API documentation][route-api] for details on
adding handlers and middleware to routes.

**Params**

* `path` **{String}**
* `returns` **{Object}** `Route`: for chaining

**Example**

```js
app.create('posts');
app.route(/blog/)
  .all(function(view, next) {
    // do something with view
    next();
  });

app.post('whatever', {path: 'blog/foo.bar', content: 'bar baz'});
```

### .all

Special route method that works just like the `router.METHOD()` methods, except that it matches all verbs.

**Params**

* `path` **{String}**
* `callback` **{Function}**
* `returns` **{Object}** `this`: for chaining

**Example**

```js
app.all(/\.hbs$/, function(view, next) {
  // do stuff to view
  next();
});
```

### .param

Add callback triggers to route parameters, where `name` is the name of the parameter and `fn` is the callback function.

**Params**

* `name` **{String}**
* `fn` **{Function}**
* `returns` **{Object}**: Returns the instance of `Templates` for chaining.

**Example**

```js
app.param('title', function (view, next, title) {
  //=> title === 'foo.js'
  next();
});

app.onLoad('/blog/:title', function (view, next) {
  //=> view.path === '/blog/foo.js'
  next();
});
```
