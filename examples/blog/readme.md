Hi, I'm having trouble getting my project to compile markdown content.

I'm using Node `5.1.0` and Assemble `0.7.3`.

#### `assemblefile.js`

```javascript
var assemble = require('assemble')
var extname = require('gulp-extname');
var app = assemble();

app.create('posts');

app.engine('md', require('engine-handlebars'));

app.task('load', function (cb) {
  app.partials('src/templates/partials/*.hbs');
  app.layouts('src/templates/layouts/*.hbs');
  app.posts('src/content/**/*.md');
  cb();
});

app.task('default', ['load'], function () {
  return app.toStream('posts')
    .on('err', console.log)
    .pipe(app.renderFile())
    .on('err', console.log)
    .pipe(extname())
    .pipe(app.dest('dist'));
});

module.exports = app;
```

#### `templates/layouts/default.hbs`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>{{title}}</title>
  </head>
  <body>
    {% body %}
  </body>
</html>
```

#### `templates/layouts/markdown.hbs`

```html
---
layout: default
---

{{#markdown}}
{% body %}
{{/markdown}}
```

#### `content/post-1.md`

```markdown
---
layout: markdown
title: test post
---

## Test Post

- Item 1
- Item 2

```

Running `assemble` gives me the following:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>test post</title>
  </head>
  <body>

  </body>
</html>
```
