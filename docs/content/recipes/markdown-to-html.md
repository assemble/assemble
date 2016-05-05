---
title: Converting markdown to HTML
description: >
  This recipe shows how to convert markdown files to HTML with Assemble.
category: recipes
---
Note that while this example shows how to use helpers with [handlebars][], the methods and examples should work with any template engine.

## Template helpers

Using helpers to process markdown provides a great deal of control and flexibility, since it allows you to limit where markdown will be rendered in your templates with a great deal of specificity, and - if the need arises - you can pass different options to the markdown renderer from one placement to the next.

**Helpers we use in the examples**

The are two different markdown helpers used in this recipe:

- `\{{md}}` helper for injecting markdown from another file or variable,
- `\{{markdown}}` block helper for rendering markdown in place

### Download and install

To run the examples, download the helpers with the following command:

```sh
# -D will save the helpers to devDependencies in package.json
$ npm install helper-md helper-markdown -D
```

Next, register the helpers with assemble:

```js
var assemble = require('assemble');
var app = assemble();

// block helper
app.helper('markdown', require('helper-markdown'));

// "include" helper
app.helper('md', require('helper-md'));
```

With that out of the way, let's review both helpers and demonstrate how they're used.

### Markdown block helper

A markdown block helper can be used to wrap any content that should be converted to markdown. Here are a few examples

**Layout usage**

Wrap the `body` tag in a layout to convert any content that uses the layout to HTML.

For example, let's pretend we have a layout named `foo.hbs`,

```handlebars
---
layout: default
---

{{#markdown}}
{% body %}
{{/markdown}}
```

Use the layout:

```handlebars
---
title: Blog Post 1
layout: post
```
