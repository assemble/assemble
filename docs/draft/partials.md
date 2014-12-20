# Partials

>


## options.partials

The default partials to use. If `partialsext` is defined, it will be appended to the `partials`.

**Example:**

```js
assemble.options({
	partials: 'default'
});
// or
assemble.option.set('partials', 'default');
```


## options.partial

Returns an expanded array of partials based on the file path, paths or glob patterns provided.

**Example:**

```js
// or
assemble.option.set('partials', 'partials/*.hbs');
```
