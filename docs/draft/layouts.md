# Layouts

>


## layout

```js
assemble.layout('default', '---\ntitle: Default Layout\n---\n');
```


## options.layout

The default layout to use. If `layoutext` is defined, it will be appended to the `layout`.

**Example:**

```js
assemble.options({
	layout: 'default'
});
// `assemble.cache.options.layout = "default"`
// or
assemble.set('layout', 'default');
```


## options.layouts

Returns an expanded array of layouts based on the file path, paths or glob patterns provided.

**Example:**

```js
assemble.options({
	layouts: ['layouts/foo/*.hbs']
});
// or
assemble.set('layouts', 'layouts/bar/*.hbs');
```

## options.layoutdir

**Example:**

```js
assemble.options({
	layoutdir: 'layouts'
});
// or
assemble.set('layoutdir', 'layouts');
```

## options.layoutext

**Example:**

```js
assemble.options({
	layoutext: '.hbs'
});
// or
assemble.set('layoutext', '.hbs');
```

