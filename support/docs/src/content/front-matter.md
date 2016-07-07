---
title: Front Matter
---

Assemble parses [YAML front-matter][google] using [gray-matter][].

## Custom parser

**Disable built-in parser**

You can use any front-matter parser you want, just make sure to disable the built-in parser first:

```js
app.disable('frontMatter');
```

**Use a custom parser**

1. create `file.data` from the parsed front-matter object
1. strip front-matter from `file.contents` after it's parsed

```js
function parser(file, next) {
  // `file.contents` is a buffer. Convert it to a string and parse front-matter
  // from it, then update `file.data` and `file.contents`
  var obj = someParser(file.contents.toString());
  file.data = obj.data;
  file.contents = new Buffer(obj.contents);
  next();
}

app.onLoad(/./, function(file, next) {
  parse(file, next);
});
```

## Expand config templates

Assemble doesn't process config templates in front-matter by default, but it's sometimes useful to have them. For example:

```html
---
path: <%%= base $>/foo.html
---

This is random content
```

To process config templates, you can use a library like [expand][].

**Example**

Pass `file.data` after front-matter is parsed, and `app.cache.data` (populated by the `app.data()` method) as context.

```js
var expand = require('expand')();

app.onLoad(/./, function(file, next) {
  file.data = expand(file.data, app.cache.data);
  next();
});
```

[google]: https://www.google.com/search?rlz=1C5CHFA_enUS689US689&espv=2&q=yaml+front+matter&oq=yaml+front+matter&gs_l=serp.3..0i67j0l3j0i22i30l6.1921.3686.0.3846.5.3.2.0.0.0.95.281.3.3.0....0...1c.1.64.serp..0.5.283...0i22i10i30.rwXXlqv16sw
