---
title: Pipeline plugins
collection: docs
category: api
---

Pipeline plugins have the same signature and conventions as [gulp][] plugins, and may be used anywhere streams are used (as with `{{name}}.src('*.hbs')` or `{{name}}.toStream('pages')`, for example).

Related: [pipeline terminology](./terminology.md#pipeline)

## Defining pipeline plugins

There are a number of ways to add plugins to a scaffold pipeline, but for the most part there are two different approaches:

1. **pre-register pipeline plugins** using the `plugin` method, then add them to a pipeline by name. Plugins registered using this method must return a stream, or a function that returns a stream.
2. **define the plugins inline** directly on the `pipeline` property. Plugins defined this way must follow the same conventions as plugins that are pre-registered using the `plugins` method.

## API

### .plugin

Register a pipeline plugin with the given `name`. Pipeline plugins must be a stream or a function that returns a stream.

```js
app.plugin(name, value);
```

**Params**

- `name`: **{String}** The plugin's name
- `value`: **{Function|Stream}** Stream or a function that returns a stream.

**Example**

```js
app.plugin('append', function(word) {
  return through.obj(function(view, enc, next) {
    var str = view.contents.toString() += word;
    view.contents = new Buffer(str);
    next(null, view);
  });
});
```

**Conventions**

Since plugins can be automatically loaded and injected into a pipeline, we recommend that plugins return a function so user options may be more easily (and automatically) defined on the plugin.

**Caveats**

When passing a stream, the same instance of the stream will be used whenever that plugin is used. This may cause unintended side affects by piping undesired files through the plugin. To avoid this, always pass in a function that returns a new stream.
