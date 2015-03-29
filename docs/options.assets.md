# options.assets

The `assets` property on the options is used to calculate the relative path from any generated files (usually HTML) to whatever folder is specified in the `assets` option. 

**Example**

Define the `assets` option in your project's [assemblefile.js](./assemblefile.md):

```js
assemble.option('assets', 'site/public');
```

Now you can use it in templates:

```handlebars
<link rel="stylesheet" href="{{assets}}/css/styles.css">
```

Renders to:

```handlebars
<link rel="stylesheet" href="site/public/css/styles.css">
```
