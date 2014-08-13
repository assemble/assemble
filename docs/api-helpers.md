
```js
var assemble = require('assemble');
var helpers = require('your-custom-helpers');

assemble
  .registerHelper('foo', require('helper-foo'))
  .registerHelper('a', helpers.a)
  .registerHelper('b', helpers.b)
  .registerHelper('c', helpers.c)

  // or define one inline
  .registerHelper('log', function (value) {
    return console.log(value);
  });
```
