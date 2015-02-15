# assemble.files

The `files` property is session-context-specific and returns the `files` collection being used in the current `task`.

```js
console.log(assemble.files);
```

Returns something like:

```js
{ home: {
    base: '/site/template/',
    content: 'foo {{ msg }} bar',
    cwd: '/site',
    data: { msg: 'hello world', src: [Object], dest: [Object] },
    options: {},
    orig: '{{ msg }}',
    path: '/site/template/pages/home.hbs',
    relative: 'home.hbs'
}}
```

**Usage in plugins**

When `files` is used inside a plugin, the stream must be bound to the session via `session.bindEmitter`:

```js
var stream = through.obj(...);
assemble.session.bindEmitter(stream);
return stream;
```
 
