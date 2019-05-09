'use strict';

var path = require('path');
var async = require('async');
var extend = require('extend-shallow');

var utils = require('../../lib/utils');
var assemble = require('../..');
var app = assemble();

/**
 * Create a boilerplate config for h5bp
 */

var Boilerplate = require('boilerplate');
var h5bp = new Boilerplate({
  options: {
    cwd: 'vendor/dist',
    destBase: 'src'
  },
  root: {src: ['{.*,*.*}'],   dest: '.'},
  css:  {src: ['css/*.css'],  dest: 'css'},
  doc:  {src: ['doc/*.md'],   dest: 'doc'},
  js:   {src: ['js/**/*.js'], dest: 'js'}
});

/**
 * Register a noop engine. Since the boilerplate
 * doesn't actually consist of templates, there is
 * nothing to render. But once you customize you'll
 * want to add an engine to do the rendering.
 */

app.engine('noop', function(view, opts, next) {
  next(null, view);
});

/**
 * Tasks
 */

app.task('h5bp', function(done) {
  async.eachOf(h5bp.targets, function(target, name, cb) {
    if (!target.hasOwnProperty('files')) {
      cb();
      return;
    }

    // log out a time-stamped message for each "files" definition
    utils.logTask(app.name, ':h5bp:' + name);

    async.each(target.files, function(files, next) {
      if (!files.src || !files.src.length) {
        next();
        return;
      }

      var opts = extend(target.options, files.options);
      var data = extend(target.data, files.data);

      // console.log(files.src)
      app.src(files.src, opts)
        .pipe(app.renderFile(data))
        .on('error', next)
        .pipe(app.dest(rename(files)))
        .on('error', next)
        .on('finish', next);
    }, cb);
  }, done);
});

app.task('default', ['h5bp']);

/**
 * Expose our instance of assemble
 */

module.exports = app;

/**
 * Custom rename function
 */

function rename(files) {
  return function(file) {
    var base = path.relative(path.resolve(file.cwd), file.base);
    var destBase = files.options.destBase;
    file.dirname = path.resolve(path.join(destBase, base));
    return file.base;
  };
}
