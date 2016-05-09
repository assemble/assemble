---
title: "Option: mergeTypes"
layout: markdown-raw
category: api
---
## options.mergeTypes

Specify the [view collections](view-collections.md) to merge onto the context by passing an array of collection names to `options.mergePartials`.

**Type:** `Array`

**Default:** All registered `partial` view types. The most commonly registered partial view types are `partials` and `includes`.

**Example**

Given the following configuration:

```js
app.create('pages'); // viewType is renderable by default
app.create('partials', {viewType: 'partial'});
app.create('includes', {viewType: 'partial'});

app.partial('foo', {content: 'abc'});
app.include('foo', {content: 'xyz'});

app.pages('bar', {content: '{{> foo }}'});
```

and the following option:

```js
app.option('mergeTypes', ['includes']);
```

Then rendering the page `bar`, like so:

```js
app.pages.getView('bar')
  .render(function(err, res) {
    console.log(res.content)
    // results in => 'xyz'
  });
```
