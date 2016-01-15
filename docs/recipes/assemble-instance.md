# Assemble instance

The main export of the assemble library is a function. More specifically, the function is the `Assemble` constructor.

**Create an instance**

```js
var assemble = require('assemble');

var app = assemble();
```

This pattern was chosen to allow you to "new up" whenever necessary:

```js
// another instance of assemble
var blog = assemble();

// yet another instance of assemble
var site = assemble();
```

