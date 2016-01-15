# Assemble instance

The main export of the assemble library is a function. More specifically, the function is the `Assemble` constructor.

**Create an instance**

```js
var assemble = require('assemble');

var app = assemble();

// another instance of assemble
var blog = assemble();

// yet another instance of assemble
var site = assemble();
```

The above examples are sugar for:

```js
var Assemble = require('assemble');
var app = new Assemble();
```
