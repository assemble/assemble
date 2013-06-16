## assemble object

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

### `init` method

Describes `init` method to `assemble.engine`, and exposes engine on `assemble.engine`.


#### Custom Engines

If you don't wish to use Handlebars as your templates engine, you may add your own engine by providing an `init` function that takes in options from the assemble task/target. You may also override the `init` function in the task/target options by providing an `initializeEngine` function that takes the engine and the options:

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


## Registering custom helpers

Custom helpers may be loaded with the current engine via `options: { helpers: []}` in the assemble task or target. But _any helpers registered at the target level will override task-level helpers_.

Glob patterns may be used to specify the path to the helpers to be loaded:

```js
assemble: {
  options: {
    helpers: ['./lib/helpers/**/*.js']
  }
}
```

Helpers can either be an object or a single `register` function. If `register` is on the object, then it calls the `register` function passing in the engine, otherwise each method is registered as a helper. 

For example, the following will result in 2 helpers being registered:

```js
module.exports.foo = function(msg) { return msg; };
module.exports.bar = function(msg) { return msg; };
```

And this will result in the `foo` helper getting register directly through Handlebars:

```js
module.exports.register = function(Handlebars, options) {
  Handlebars.registerHelper('foo', function(msg) {
    return msg;
  });
};
```

## Passing `assemble.options` into helpers

Any `assemble.options` may be passed to custom helpers when the helper defines the `register` method. For example:

Given our `Gruntfile.js` has the following `assemble` task configuration:

```js
assemble: {
  options: {
    version: '0.1.0', // or we could use '<%= pkg.version %>'
    helpers: ['lib/helpers/**/*.js']
  },
  blog: {
    files: {
      'articles/': ['src/posts/*.md']
    }
  }
}
```

And given we have defined a custom helper, `opt`, which gets properties from the `assemble.options` object and returns them:

```js
module.exports.register = register = function(Handlebars, options) {

  Handlebars.registerHelper('opt', function(key) {
    return options[key] || '';
  });

};
```

We can now user our helper in a Handlebars template like this:

``` html
<div>Version: v{{opt 'version'}}</div>
```

And the output would be:

``` html
<div>Version: v0.1.0</div>
```

#### Register Partials

Call `registerPartial` by passing in an engine:

```javascript
registerPartial(assemble.engine, 'partialName', content);
```

Example of how this would be setup in the `options` of the assemble task or target:

```javascript
assemble: {
  options: {
    registerPartial: function(engine, name, content) {
      var tmpl = engine.compile(content);
      engine.engine.registerPartial(name, tmpl);
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

### Example custom Grunt.js plugin, "`steps`"

This shows how to create a custom Grunt plugin using Assemble steps. 

``` js
grunt.registerMultiTask('steps', 'examples of using steps in assemble', function() {

  var done = this.async();

  grunt.verbose.writeln(('Running ' + this.name + ' - ' + this.target).cyan);

  // require assemble
  var assemble = require('assemble');

  // initalize assemble with the currently running task
  assemble = assemble.init(this);

  // let's see what assemble has now
  grunt.verbose.writeln(require('util').inspect(assemble));
  grunt.verbose.writeln('');

  // you can see there are some defaults that assemble sets up
  // add the steps you want to execute

  // add a custom string property to the assemble object
  assemble.step(function(assemble, next) {
    grunt.log.writeln('running step 1');
    assemble.step1 = 'This is step 1';
    next(assemble);
  });

  // add a custom object property to the assemble object
  assemble.step(function(assemble, next) {
    grunt.log.writeln('running step 2');
    assemble.step2 = {
      data: 'This is step 2'
    };
    next(assemble);
  });

  // add a custom array property to the assemble object
  assemble.step(function(assemble, next) {
    grunt.log.writeln('running step 3');
    assemble.step3 = ['This is step 3'];
    next(assemble);
  });

  // the last step will use the custom properties set up in the first 3 steps
  assemble.step(function(assemble, next) {
    grunt.log.writeln('running step 4');

    grunt.log.writeln('  data from other steps: ');
    grunt.log.writeln('    ' + assemble.step1);
    grunt.log.writeln('    ' + assemble.step2.data);
    grunt.log.writeln('    ' + assemble.step3[0]);
    grunt.log.writeln('');

    next(assemble);
  });

  // now run build
  assemble.build(function(err, results) {
    grunt.log.writeln('build finished');
    done();
  });

});
```

### Example Gruntfile with `steps` task

The following code is for an entire `Gruntfile.js`, with an example of how to use `step` and `build` in the simpilest way.

```javascript
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    steps: {
      target1: {
        // do something
      },
      target2: {
        // do something else
      }
    }
  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task.
  grunt.registerTask('default', ['jshint', 'steps']);
};
```