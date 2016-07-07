---
title: Context
category: subjects
description: This document explains how data is passed to views, related methods, and tips for getting the results you need
---

Context can be thought of as "the data that is passed to views" (see a [better definition](#what-is-context) below), but knowing more about how context is created and the options available for modifying it will also help you:

- formulate strategies for creating more composable, resuable data (and views),
- understand how to prevent or resolve potential _data conflicts_
-

**Jump ahead:**

<!-- toc -->

## What is context?

The `context` is an object that is created at runtime from one or more data sources, for the purposes of being passed to the render method to resovle view values

## .mergeContext

Context is built at runtime by the `.mergeContext()` method, which combines data from multiple sources before passing it to views. This method may be [overridden if necessary](#custom-merge-function).

**Example:**

```js
app.page('abc', {content: '---\ntitle: About\n---\nThis is <%%= title %>.' }, {title: 'Home'});
```


## Context objects

Context is created from several different objects, some of which are only available at [runtime](#runtime-objects), and some of which are [cached](#cached-objects).


### Cache objects

Cached objects are either created by the `app.data()` method, a view "view" method, such as `app.page()`, or by directly adding/modifying an object.

  - `app.locals`
  - `app.data`: typically from [front-matter](), but can be directly populated
  - `locals`


### Runtime objects

Runtime context is created from the following objects:


  - `this.cache`
  - `this.cache.data`
  - `this.cache._locals`
  - `this.options`
  - value returned from `.mergePartials()`


### Custom merge function

If you want the `.mergeContext()` function to behave differently, just pass a custom function on the options:

```js
app.option('mergeContext', function(view, locals) {
  // to get you started with your custom logic
  console.log(view);
  console.log(locals);
  console.log(this);
});
```

In your `.mergeContext()` function, pay special attention to these objects:

  - `this.cache`
  - `this.cache.data`
  - `this.options`


## preferLocals

By default, the `data` object on a view is given preference over the `locals` object. To reverse this, do:

```js
this.enabled('preferLocals');
```


```js
app.option('mergeContext', function () {
  // do stuff
});
```
