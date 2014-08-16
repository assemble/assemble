**Examples:**

```js
assemble.engine('hbs', handlebars, {
  layouts: {
    delims: ['{{', '}}']
    defaultLayout: 'default'
  },
  helpers: {},
  partials: {},
  destExt: '.html'
});


assemble.engine('tmpl', lodash, {
  delims: ['{%', '%}']
  layouts: {
    delims: ['{{', '}}']
    defaultLayout: 'default'
  },
  imports: {},
  interpolate: /\{\%=([\s\S]+?)\%\}/g,
  evaluate: /\{\%([\s\S]+?)\%\}/g,
  escape: /\{\%-([\s\S]+?)\%\}/g
});
```
