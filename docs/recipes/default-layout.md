# Default layout

> This recipe demonstrates how to define or force a default layout.

Basically, to set the default-layout for the entire app, use a global option `layout`:

```
app.option('layout', 'the-special-one');
```

This equals to setting the default layout in every document in the front matter yml:

```
---
title: This is the title
layout: the-special-one
---
```

The layout can also be set using some middleware as the following example demonstrates:

```js
app.preLayout( /./, function ( view, next ) {
	// if the layout is not defined, set it to a specific one ...
	if ( !view.layout ) {
		view.layout = 'whatever-layout';
	}
	next();
} );
```
