**Example:**

```js
var assemble = require('assemble');
var helpers = require('foo-helpers');

assemble
  .addHelper('foo', require('helper-foo'))
  .addHelper('a', helpers.a)
  .addHelper('b', helpers.b)
  .addHelper('c', helpers.c)
  .addHelper('log', function (value) {
    return console.log(value);
  });
```
