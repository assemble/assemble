# Render templates

To render templates, you first need to choose a template engine.

_(Assemble ships with handlebars templates using [], but custom engines and plugins may also be used.)_

```js
var assemble = require('assemble');

app.task('default', function () {
  app.src('templates/*.hbs')
    .pipe(app.dest('dist'));
});
```

Run `assemble` from the command line to run the `default` task in your `assemblefile.js`.
