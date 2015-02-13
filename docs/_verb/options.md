# Options API

> Setting and getting options 

The Options API exposes methods for setting and getting options in Assemble. Assemble uses some options as configuration settings for assemble's built-in features, such as `layout` and `layoutdir`, but options can be defined and used in any way you need in your projects. (see a list of the [built-in options]).

## .option

Set an option

```js
assemble.option('foo', 'bar');
// or as an object
assemble.option({foo: 'bar'});
```

**Example usage:**

Pass config settings directly:

```js
assemble.option({
  layoutdir: 'templates/layouts',
  layout: 'blog'
});
```
