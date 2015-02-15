# Template helpers

> Using helpers in templates


## Overview

- Helpers are stored on the `assemble.options` object.
- Helpers can be defined and used in any way you need in your projects. 
- Assemble uses the same API to set [default options][built-in options] for some of assemble's built-in features, such as `layout` and `layoutdir`. Defaults can easily be changed, disabled or overridden.


## What are helpers?

Helpers are just regular javascript functions that can be used in templates. Helpers are used to inject or transform data or content. 

**Example**

We could use an `uppercase` helper to make the `title` of a page uppercase.

```handlebars
This is the {{uppercase title}} page
```

Assemble makes it easy to author and use custom template helpers, regardless of the engine being used. As long as the engine supports the use of helper functions, assemble should be able to register the helpers.


### Registering helpers

The uppercase helper in this example is just a function that is registered as a helper with assemble:

```js
assemble.helper('uppercase', function(str) {
  return str.toUpperCase();
});
```

If you're planning on authoring your own helpers, read our [helper recommendations](#helper-recommendations) before you get started.

## Built-in helpers

By default, assemble loads an extensive collection of helpers from [handlebars-helpers]. As long as you're not using a custom engine, any of those helpers can be used in templates without any additional setup.

See the [handlebars-helpers] repo for more information.

## Template-type helpers

Every template type ([page](./pages.md), [partial](./partials.md), [layout](./layouts.md), and any [custom type]) has a convenience helper with the same name as the template type.

For example, the `.partial()` template type has a `partial` helper. 

**Example**

Add a partial (template)

```js
assemble.partial('button', '<button>Click me!</button>');
```

Now, add `{{partial "button"}}` to any template where you want the button partial to be inserted. If the template type was `widget` instead of partial, you would use `{{widget "button"}}` instead.


## Helper recommendations

If you're planning to author a helper, here are some suggestions to help you get started:

- **generic**: if the helper doesn't need to have any assemble-specific logic, try to make it generic whenever possible. Ideally, a helper is just be a javascript library that could be used anywhere, not just in templates. 
- **publish**: publish the helper so that other developers can use it
- **naming**: don't use an overly generic name for your helper if it might be used in a scenrio where naming conflicts can occur. For example, `content`, `body`, and `partial` would be bad names.


[handlebars-helpers]: https://github.com/assemble/handlebars-helpers


