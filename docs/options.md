# Options

> Setting and getting options in Assemble

## Options API



**Examples:**

Pass config settings directly:

```js
assemble.option({
  layoutdir: 'templates/layouts',
  layout: 'blog'
});
```

Load settings from a yaml file:

```js
assemble.option('.assemble.yml');
```

Use glob patterns to specify the files to use:

```js
assemble.option('settings/*.{json,yml}');
```
