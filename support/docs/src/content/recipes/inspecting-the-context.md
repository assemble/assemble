---
title: Inspecting the context
category: recipes
---
**What does "inspecting the context mean"?**

Generally, "inspecting the context" means that we're attempting to inspect the object that that is created in memory for rendering templates.

**Where can we see the context?**

Since the context object is created in-memory at render time, to inspect it we need access to the object _as a template is actually being rendered_ (not before or after), which means there is really only one place to do it: inside a helper function.

## log helper

A simple `log` helper can be used to show (in the console) any object we pass to it. For example, try adding the following to your `assemblefile.js`:

```js
app.helper('log', function(context) {
  console.log(context);
});
```

Next, add the following to the template you want to inspect:

```handlebars
{{log .}}
```

_(Note that handlebars uses `.` as an alias for `this`. You can replace the `.` with any variable you want to inspect.)_

**Other objects**

Inside the helper, there are a number of different objects we can inspect, depending on how we're building up the context. Here is a quick overview:

```js
app.helper('log', function(context) {
  console.log(arguments);
  console.log(context);      // the object passed to the helper
  console.log(context.hash); // hash arguments, like `foo="bar"`

  console.log(this);         // handlebars context
  console.log(this.options); // assemble `options`
  console.log(this.context); // context of the current "view"
  console.log(this.app);     // assemble instance
});
```

## Debugging

**Detective work**

Sometimes it takes a little more work to figure out what's happening. In addition to inspecting the context at render time, we can get a better perspective on what's happening if we also:

- **inspect pre-render data**: inspect the objects that will be used to create the context **before** passing the object to the `render` method
- **diff content**: diff the generated content **after** the view is rendered (assuming the view makes it this far and is actually being rendered)
- **inspect post-render data**: inspect the `view.data` object post-render to see what, if anything, has been changed

```js
// before
// - inspect `locals`
// - inspect `view.data`
// - inspect `app.cache.data`
app.render(view, locals, function(err, res) {

  // after
  // - inspect `res.data`
  console.log(res.data);
});
```
