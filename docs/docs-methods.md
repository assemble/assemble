## `init` method

Describes `init` method to `assemble.engine`, and exposes engine on `assemble.engine`.


## Custom Engines

If you don't wish to use Handlebars as your templates engine, you may add your own engine by providing an init function that takes in options from the assemble task/target. You may also override the `init` function in the task/target options by providing an `initializeEngine` function that takes the engine and the options:

```js
assemble: {
  options: {
    engine: 'consolidate',
    initializeEngine: function(engine, options) {
      engine.engine.swig.init(options);
    }
  },
  docs: {
    files: {
      'docs/': ['src/templates/**/*.tmpl']
    }
  }
}
```

Assemble will attempt to load an engine and automatically add it's own wrapper methods around it while holding an instance of the engine. This is a way for engine plugin authors to write adapters between other engines and assemble's wrapper. To make these functions on the options useful, we've exposed the underlying engine through the `assemble.engine` object so **developers can use the raw engine**. 

This is particularly useful when **a)** a library such as [consolidate][] is used, where the engine is `consolidate`, and **b)** the developer wants to use another engine such as [handlebars](https://github.com/wycats/handlebars.js), [swig](https://github.com/paularmstrong/swig), [mustache](https://github.com/janl/mustache.js) etc.

* The `init` function allows assemble to pass in options to be used in initializing this engine plugin.
* `init` function is exposed, and [helper-lib](https://github.com/assemble/helper-lib) is registered inside the init so that options can be passed in.

Admittedly, the `engine.engine` syntax is strange. This is "alpha", so feedback and pull requests are especially welcome if you have ideas for improving this.


### Register Helpers

Call `registerFunctions`, to register custom helpers or "filters", by passing in an engine:

```javascript
registerFunctions(assemble.engine);
```

Example of how this would be setup in the `options` of the assemble task or target:

```javascript
assemble: {
  options: {
    registerFunctions: function(engine) {
      var helperFunctions = {};
      helperFunctions['foo'] = function() { return 'bar'; };
      engine.registerFunctions(helperFunctions);
    }
  },
  site: {
    files: {
      'dist/': ['src/templates/**/*.tmpl']
    }
  }
}
```

### Register Partials

Call `registerPartial` by passing in an engine.

```javascript
registerPartial(assemble.engine, 'partialName', content);
```

Example of how this would be setup in the `options` of the assemble task or target:

```javascript
assemble: {
  options: {
    registerPartial: function(engine, name, content) {
      var tmpl = engine.compile(content);
      engine.registerPartial(name, tmpl);
    }
  },
  blog: {
    files: {
      'dist/blog/': ['src/templates/**/*.tmpl']
    }
  }
}
```

[consolidate]: https://github.com/visionmedia/consolidate.js/


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
