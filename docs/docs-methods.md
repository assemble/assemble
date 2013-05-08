### assemble object

Methods to the assemble object can be created using:

```javascript
var assemble = require('assemble').init(this);
```
  * the `this` object is from the grunt task, and can be accessed in assemble "steps" through `assemble.task`
  * the `init` method does some initial option configuration and sets the following properties on the assemble object:


```javascript
assemble.task;    // refers to the grunt task
assemble.options; // refers to the task.options merged with assemble defaults
assemble.files;   // refers to the task.files
```
 
### assemble steps

There are also methods to setup the assemble steps, and then execute the build:

The `step` function takes a function which takes 2 parameters `function(assemble, next)`:

  1. `assemble` is the actual assemble object
  2. `next` is a callback function that needs to be called when finished executing this step


See the following example:

```javascript
assemble.step(function(assemble, next) {
  // do some code here
  // you can add properties to assemble which can be accessed in later steps
  assemble.myCustomProperty = { foo: 'bar' };

  // always call next when finished and pass back the assemble object
  next(assemble);
});
```

#### the `step` function

The `step` function also returns the current assemble object so it's chainable...

```javascript
var assemble = require('assemble').init(this)
    .step(step1)
    .step(step2)
    .step(step3)
    .build(done);
````

#### the `build` function

The `build` function takes a callback that is called when the build process is complete. The build process calls the steps that were previously setup, passing in the `assemble` object.

```javascript
assemble.build(function(err, result) {
  if(err) {
    console.log(err);
    return;
  }
  console.log('finished building');
});
```