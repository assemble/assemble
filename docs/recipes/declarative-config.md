# Using a grunt-style declarative config



```js
app.config({
  renameKey: function (key) {
    return path.basename(key, path.extname(key));
  },
  templates: {
    pages: {
      base: 'templates',
      patterns: '*.hbs',
      options: {},
    },
    docs: {
      patterns: '*.md',
      options: {},
    },
    layouts: {
      base: 'templates/layouts',
      patterns: '*.hbs',
      options: { viewType: 'layout' },
    },
    partials: {
      base: 'templates/partials',
      patterns: '*.hbs',
      options: { viewType: 'partial' },
    }
  }
});
```
