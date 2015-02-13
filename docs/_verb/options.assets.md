The `assets` property on the options is used to calculate the relative path from any generated files (usually HTML) to whatever folder is specified in the `assets` option.  For example, say you have the following template, `foo.hbs`:

```handlebars
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Foo</title>
    <link rel="stylesheet" href="\{{assets}}/css/styles.css">
  </head>
  <body>
    \{{> body }}
  </body>
</html>
```

Note the `\{{assets}}` handlebars expression. When `foo.hbs` is rendered, this expression will be resolved with the value that is calculated from `foo`'s destination to whatever value is defined in  `options.assets`. So this:

```js
assemble: {
  options: {
    assets: 'dist/public'
  },
  site: {
    src: 'templates/foo.hbs',
    dest: 'dist/'
  }
}
```

Results in `dist/foo.html`, with this content:

```handlebars
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Foo</title>
    <link rel="stylesheet" href="public/css/styles.css">
  </head>
  <body>
    ....
  </body>
</html>
```
