---
title: Render templates
category: recipes
---
**Registering engines**

Engines are registered using the [.engine](/api/engines#engine) method. The name you choose for the engine is used by assemble.

```js
// render handlebars templates in `.hbs` files
app.engine('hbs', require('engine-handlebars'));
```

Note that the name you use when registering the engine will be used by assemble for automatically matching the file extensions of files to render.

```js
var assemble = require('assemble');
var app = assemble();

app.engine('hbs', require('engine-handlebars'));

app.task('default', function() {
  return app.src('templates/*.hbs')
    .pipe(app.dest('dist'));
});

module.exports = app;
```

Run `assemble` from the command line to run the `default` task in your `assemblefile.js`.
