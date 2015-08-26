# Render a layout

> Describes how to render a layout before applying it to a view

## onLayout middleware

The `.onLayout()`

```js
assemble.onLayout(/\.hbs$/, function (view, next) {
  // temporarily remove the `layout` property from the layout.
  // this we can avoid applying the layout's layout when it's rendered
  var layout = view.currentLayout.layout;
  view.currentLayout.layout = 'nil';

  view.currentLayout.render(function (err, res) {
    if (err) return next();
    // restore the layout's `layout` property
    view.currentLayout.layout = layout;
    next();
  });
});
```