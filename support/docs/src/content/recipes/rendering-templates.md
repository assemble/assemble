---
title: Rendering templates
---


The `.render` method is used for rendering [views](docs/views.md)


You can use [any engine](template-engines.md) to render templates with assemble.

```js
var assemble = require('assemble');
var app = assemble();

// add a "page"  nd render it!
app.page('home.hbs', {content: 'This is \{{title}}'})
app.render({title: 'Home!'}, function(err, view) {
  if (err) {
    console.log(err);
    return;
  }
  console.log(view.contents.toString());
  //=> 'This is Home!'
});
```


