---
title: Strip indentation in views
---

To strip indentation in `view.contents`, you can create a helper using the [strip-indent](https://www.npmjs.com/package/strip-indent) library.

**Example**

```js
var stripIndent = require('strip-indent');

// handlebars block helper
app.helper('stripIndent', function(options) {
  return stripIndent(options.fn(this));
});

// generic helper
app.helper('stripIndent', function(str) {
  return stripIndent(str);
});
```

## Usage

**Text**

Strip indentation from specific text or content:

```handlebars
{{#stripIndent}}
    Foo
      Bar
{{#stripIndent}}
```

Results in:

```html
Foo
  Bar
```

**Layouts**

When used in a layout, the following would strip the indentation from the entire string passed to the `body` tag.

```handlebars
<!-- layout.hbs -->
{{#stripIndent}}
    {% body %}
{{#stripIndent}}
```

Tip: create an "intermediary" layout, which only exists for stripping indentation using this helper. Any layout or template that needs indentation stripped could use this layout.
