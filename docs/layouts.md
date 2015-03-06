# Layouts

> Layout templates are used to "wrap" other templates with common content or code.


## Overview

- Layouts are stored as objects on the `assemble.views.layouts` object (all [template types] follow this convention)
- The `.layout()` and `.layouts()` methods are used to add layouts to the `assemble.views.layouts` object.
- Each layout must have a unique key. This is usually a file path, but can be anything.
- Layouts must be defined as key/value pairs. 
- The `.layout()` and `.layouts()` methods use Assemble's built-in [loaders] to add layouts to the `assemble.views.layouts` object, 
- [custom loaders](./loaders.md#custom-loaders) may be used


### Defining layouts

> Layouts can be defined and stored as files, then loaded from the file system, or they can be defined as objects and loaded directly.

If you use Handlebars (Assemble's default template engine), you might have a layout that looks something like this:

```handlebars
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

Depending on your project's needs, you can save this to a file, like `my-layout.hbs`, or you can directly load the layout using the `.layout()` method.

**Example**

```js
assemble.layout('my-layout', {
  content: [
    '<!DOCTYPE html>',
    ' <html lang="en">',
    '   <head>',
    '     <meta charset="UTF-8">',
    '     <title>{{title}}</title>',
    '   </head>',
    '   <body>',
    '     {% body %}',
    '   </body>',
    ' </html> ',
  ].join('\n')
});
```

Of course, you don't need to define the layout using the "array trick", we just use that in examples since it's easier on the eyes.

### Nested layouts

In Assemble v0.6.0, any template can use a layout, even partials and other layouts.

**Example nested layouts**

The following example shows three layouts:

1. The `default` layout, which will serve as the outtermost "wrapper" to be used with all other layouts.
1. The `right-col` layout, which would be used for pages need a right column
1. The `left-col` layout, which would be used for pages need a left column

```js
// the outtermost layout
assemble.layout('default', {
  content: [
    '<!DOCTYPE html>',
    ' <html lang="en">',
    '   <head>',
    '     <meta charset="UTF-8">',
    '     <title>{{title}}</title>',
    '   </head>',
    '   <body>',
    '     {% body %}',
    '   </body>',
    ' </html> ',
  ].join('\n')
});

// right column
assemble.layout('right-col', {
  content: '<div class="col-right">{% body %}</div>',
  layout: 'default'
});

// left column
assemble.layout('left-col', {
  content: '<div class="col-left">{% body %}</div>',
  layout: 'default'
});
```


### Loading layouts

> Layout templates can be loaded from the file system, or directly from an object defined on the `.layout()` or `.layouts()` methods

**Glob patterns**

As a string:

```js
assemble.layouts('foo/*.hbs');
```

Or as an array:

```js
assemble.layouts(['foo/*.hbs', 'bar/*.hbs']);
```

**As an object**

The first parameter is the name of the layout, the second is an object that must have a `content` property.

```js
assemble.layout('default', {content: '<div>{% body %}</div>'});
```

**Chaining**

Most methods are chainable, so you can also do:

```js
assemble
  .layouts('foo/*.hbs')
  .layouts('bar/*.hbs')
  .layouts('baz/*.hbs');
```

## Custom layouts

It's possible to further differentiate layouts by creating a custom [template type].

**Example custom layouts**

Let's create a custom [template type,] arbitrarily named `section`:

```js
assemble.create('section', { isLayout: true });
```

With the above defined, here is what has taken place:

1. We have created a new template type, `section`
2. We can now load or define `section` templates using the `assemble.section()` and `assemble.sections()` methods
1. Since `isLayout` was defined, Assemble will recognize any `section` template as a `layout`

**Example usage**

```js
assemble.section('default', { content: '<div>{% body %}</div>' });
```

## Related 

- [custom templates]
- [pages]
- [partials]

[partials]: partials.md
