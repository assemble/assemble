
**Examples:**

Pass config settings directly:

```js
assemble.load({
  layoutdir: 'templates/layouts',
  layout: 'blog'
});
```

Load settings from a yaml file:

```js
assemble.load('.assemble.yml');
```

Use glob patterns to specify the files to use:

```js
assemble.load('settings/*.{json,yml}');
```

Visit [load-options] to see all available options or to report issues
related to this method.
