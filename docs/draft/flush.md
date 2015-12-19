

```js
'use strict';

/**
 * Module dependencies.
 */
var gutil = require('gulp-util');
var through = require('through2');


assemble.enable('buffer files');


/**
 * In this example, each `file` is pushed through so that other plugins can
 * continue on. Once all of the files are cached and the last file is pushed
 * through, the flush function is called so you can do any additional processing
 * on the entire file set.
 */

module.exports = function plugin(assemble) {
  return function (options) {
    return through.obj(function (file, encoding, callback) {

      this.push(file);
      return callback();
    }, function (cb) {
      assemble.files(function (files) {
        // list of files
        cb();
      }, function(err) {
        if (err) { return err; }
      });
    });
  };
};



/**
 * In this example, all of the files are buffered first before
 * pushing the changed files through.
 *
 * This means that plugins that come later in the pipeline will
 * be held up until this process completes.
 */

var foo = require('foo');

module.exports = function plugin(assemble) {
  return function (options) {
    return through.obj(function (file, encoding, callback) {
      return callback();
    }, function (cb) {
      assemble.files.forEach(function (file) {
        file = foo(file);
        this.push(file);
      }.bind(this));
      cb();
    });
  };
};


/**
 * This example uses promises to
 */

module.exports = function plugin(assemble) {
  return function (options) {
    return through.obj(function (file, encoding, next) {

      this.push(file);
      return next();
    }, function (cb) {

      assemble.files()
        .then(function (files) {
          // list of files
          return files;
        })
        .then(function (files) {
          // list of files
          cb();
        });
    });
  };
};
```