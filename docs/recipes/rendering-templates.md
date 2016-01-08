# Render templates

To render templates, you first need to choose a template engine. Engines are registered using the `.engine()` method:

**Example**

```js
// render handlebars templates in `.hbs` files
app.engine('hbs', require('engine-handlebars'));
```

Note that the name you use when registering the engine will be used by assemble for automatically matching the file extensions of files to render. 


```js
var assemble = require('assemble');

app.task('default', function () {
  app.src('templates/*.hbs')
    .pipe(app.dest('dist'));
});
```

Run `assemble` from the command line to run the `default` task in your `assemblefile.js`.
