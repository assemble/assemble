---
title: Render markdown with layouts
description: This recipe shows how to use a `markdown` block helper inside a layout to convert any injected markdown content to HTML.

category: recipes
---
## Download and install

First, you can download everything you will need to run the examples with the following command:

```sh
# -D will save the helpers to devDependencies in package.json
$ npm install -D helper-md helper-markdown
```

If assemble is not already installed globally, you can do so with the following command:

```sh
$ npm install -g assemble
```

_(See [other options for installing assemble](installing-assemble.md))_

Next, add the following to an `assemblefile.js`

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

A markdown block helper can be used to wrap any content that should be converted to markdown.

**Layouts**

Wrap the `body` tag in a layout to convert any content that uses the layout to HTML.

For example, assuming `templates/posts/a.md` has the following contents:

```handlebars
{{#markdown}}
{% body %}
{{/markdown}}
```

For example, assuming `templates/posts/a.md` has the following contents:

```handlebars
---
layout: foo
---

# Zebras and Elephants

> A 2-year old's guide to the the world
```
