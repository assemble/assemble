
```js
var assemble = require('assemble');
var app = assemble();

// create a collection
app.create('docs');

// add a template to the collection
app.docs('foo', {content: 'this is content'});
```