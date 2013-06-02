## Methods

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

#### example `Gruntfile.js` file

The following code is an entire `Gruntfile.js` file that shows how to use `step` and `build` in the simpilest way

```javascript

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    // package.json
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        jshintrc: './.jshintrc'
      },
      files: [
        'Gruntfile.js'
      ]
    },

    steps: {
      target1: {

      },
      target2: {

      }
    }

  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');

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

  // Default task.
  grunt.registerTask('default', [
    'jshint',
    'steps'
  ]);

  // Tests to be run.
  grunt.registerTask('test', [
    'jshint'
  ]);
};
```
