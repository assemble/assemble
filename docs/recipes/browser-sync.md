# Assemble and Browser-Sync

> This recipe uses assemble and [browser-sync](https://www.browsersync.io/) to both serve the files but also update the served files if needed.

## Purpose of this recipe
- Convert some .less files to a single style sheet (.css file).
- Convert some markdown files to html output, containing also a link to the generated CSS file.
- Servce the files in the local browser automatically
- Create some watchers on
	- all .less files (`./less` folder)
	- all content files (`./content` folder
- In case any watcher is triggered, update either the stylesheets or the generated html files.

**Main file:**
```js
'use strict';
var assemble = require( 'assemble' );
var extname = require( 'gulp-extname' );
var less = require( 'gulp-less' );
var browserSync = require( 'browser-sync' ).create();
var path = require( 'path' );

var app = assemble();

app.task( 'init', function ( cb ) {
	app.helper('markdown', require('helper-markdown'));
	app.layouts( path.join( __dirname, './templates/layouts/**/*.hbs' ) );
	cb();
} );

app.task( 'css', function () {
	return app.src( path.join( __dirname, './less/default.less' ) )
		.pipe( less() )
		.pipe( app.dest( path.join( __dirname, './.build/css' ) ) )
		.pipe( browserSync.stream() )
} );

app.task( 'serve', function () {
	browserSync.init( {
		port: 8080,
		startPath: 'page-1.html',
		server: {
			baseDir: path.join( __dirname, './.build' )
		}
	} )
} );

app.task( 'content', ['init'], function () {
	return app.pages.src( path.join( __dirname, './content/**/*.{md,hbs}' ) )
		.pipe( app.renderFile() )
		.on( 'err', console.error )
		.pipe( extname() )
		.pipe( app.dest( path.join( __dirname, './.build' ) ) )
		.pipe(browserSync.stream());
} );

app.task( 'default', ['css', 'content', 'serve'], function () {
} );

app.watch( path.join(__dirname, './content/**/*.md'), ['content']);
app.watch( path.join(__dirname, './less/**/*.less'), ['css']);

module.exports = app;
```

**less/default.less**
```css
@import "typography.less";
@import "variables.less";
```

**less/typography.less**
```css
html, body {
	font-family: @defaultFont;
	color: @mainColor;
}

h1 {
	color: @secondColor;
}
```

**less/variables.less**
```css
@mainColor: #666;
@defaultFont: Arial, "Helvetica Neue", Helvetica, sans-serif;
```

**templates/layouts/default.hbs**
```html
<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>{{title}}</title>
	<link rel="stylesheet" href="css/default.css">
</head>
<body>
<h1>{{title}}</h1>
{{#markdown}}
{% body %}
{{/markdown}}
</body>
</html>
```

**content/page-1.md**
```
---
title: Page 1
layout: default
---
This is the content of page 1
```
