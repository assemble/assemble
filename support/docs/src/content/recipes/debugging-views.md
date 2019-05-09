---
title: Debuggine views
related: 
  recipes: ['inspecting-the-context']
---

## Middleware

To quickly inspect the `view` object at each stage of the render cycle, create a generic middleware function that logs out the view and the "stage":

```js
function middleware(stage) {
  // customize the regex for matching `view.path` if necessary
  app[stage](/./, function(view, next) {
    // change `view.contents` to something else if you 
    // want to inspect a different property
    console.log(stage, view.contents.toString());
    next();
  });
}
```

**Usage**

Call the function with the stage you want to inspect:

```js
middleware('onLoad');
middleware('preCompile');
middleware('postCompile');
middleware('preRender');
middleware('postRender');
```
