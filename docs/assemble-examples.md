# Usage examples

Simple example of using data files in both `.json` and `.yml` format to build Handlebars templates.

```javascript
assemble: {
  docs: {
    options: {
      data: 'src/data/**/*.{json,yml}'
    },
    files: {
      'dist/': ['src/templates/**/*.hbs']
    }
  }
}
```

