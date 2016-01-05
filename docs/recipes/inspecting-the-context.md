# Inspecting the context

Generally, "inspecting the context" means that we're looking at the object that will be used for rendering a template or templates.

**Where can we see the context?**

The context object is created in-memory at render time, and to inspect it we need to see the object _as a template is being rendered_ (not before or after), which means there is really only one place to do it: inside a helper function.

**Create a helper**

A simple `log` helper can be used to show any object we pass to it in the console. Add the following to your `{{configfile}}.js`:

```js
app.helper('log', function(context) {
  console.log(context);
});
```
Next, add the following to the template you want to inspect:

```handlebars
{{log .}}
```
Handlebars uses `.` as an alias for `this`. You can replace the `.` with any variable you want to inspect.

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