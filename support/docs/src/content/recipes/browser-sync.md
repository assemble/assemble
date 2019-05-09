---
title: Assemble and Browser-Sync
description: >
  Use assemble and [browser-sync](https://www.browsersync.io/) to both serve the files but also update the served files if needed.
category: recipes
---

## Purpose of this recipe

* Convert multiple `.less` files to a `.css` file.
* Convert markdown files to `.html`, with link to the generated CSS file.
* Service the files in the local browser automatically
* Watch the following files for changes:
	- all `.less` files
	- all markdown content files and `.hbs` (handlebars) templates
* When `.watch` is triggered, update the `.css` stylesheets or generated `.html` files.

## Tasks

**Main file**

The following example shows how to setup your `assemblefile.js`:

```js
var path = require('path');
var less = require('gulp-less');
var assemble = require('assemble');
var extname = require('gulp-extname');
var browserSync = require('browser-sync').create();
var watch = require('base-watch');

/**
 * Create an instance of assemble
 */

var app = assemble();

/**
* Load plugins
*/
app.use(watch());

/**
 * Load helpers
 */

app.helper('markdown', require('helper-markdown'));

/**
 * Add some basic site data (passed to templates)
 */

app.data({
  site: {
    title: 'My Site'
  }
});

/**
 * Pre-process LESS to CSS
 */

app.task('css', function() {
  return app.src('less/default.less')
    .pipe(less())
    .pipe(app.dest('site/css'))
    .pipe(browserSync.stream());
});

/**
 * Static server
 */

app.task('serve', function() {
  browserSync.init({
    port: 8080,
    startPath: 'page-1.html',
    server: {
      baseDir: 'site'
    }
  });
});

/**
 * Load templates
 */

app.task('load', function(cb) {
  app.layouts('templates/layouts/**/*.hbs');
  cb();
});

/**
 * Generate site
 */

app.task('content', ['load'], function() {
  return app.src('content/**/*.{md,hbs}')
    .pipe(app.renderFile())
    .on('err', console.error)
    .pipe(extname())
    .pipe(app.dest('site'))
    .pipe(browserSync.stream());
});

/**
 * Watch source files
 */

app.task('watch', function() {
  app.watch('content/**/*.md', ['content']);
  app.watch('less/**/*.less', ['css']);
});

/**
 * Default task
 */

app.task('default', ['css', 'content'], app.parallel(['serve', 'watch']));

/**
 * Expose the assemble instance
 */

module.exports = app;
```

## Styles

**less/default.less**

```css
@import "typography.less";
@import "variables.less";
```

**less/typography.less**

```css
html,
body {
	font-family: @defaultFont;
	color: @mainColor;
}

h1 {
	color: @secondColor;
}
```

**less/variables.less**

```less
@mainColor: #666;
@secondColor: #333;
@defaultFont: Arial, "Helvetica Neue", Helvetica, sans-serif;
```

## Templates

**templates/layouts/default.hbs**

```html
<!doctype html>
<html lang="en">
  <head>
  	<meta charset="UTF-8">
  	<title>\{{title}} | \{{site.title}}</title>
  	<link rel="stylesheet" href="css/default.css">
  </head>
  <body>
    <h1>\{{title}}</h1>

<!-- keep inline markdown left-aligned, so it formats correctly -->
\{{#markdown}}
{% body %}
\{{/markdown}}

  </body>
</html>
```

## Markdown content

**content/page-1.md**

```html
---
title: Page 1
layout: default
---

This is the content of {{title}}.
```
