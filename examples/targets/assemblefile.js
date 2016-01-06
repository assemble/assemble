'use strict';

var async = require('async');
var extend = require('extend-shallow');
var Target = require('expand-target');
var utils = require('../../lib/utils');
var assemble = require('../..');
var app = assemble();

/**
 * Define a target (similar to a Grunt "target")
 */

var target = new Target({
  data: {title: 'My Site'},
  options: {
    cwd: 'src',
    destBase: 'dist'
  },
  files: [
    {src: 'posts/*.md', dest: 'blog/', data: {title: 'My Blog'}},
    {src: 'pages/*.hbs'}
  ]
});

/**
 * Register engines for rendering templates
 */

app.engine('hbs', require('engine-handlebars'));
app.engine('md', require('engine-base'));

/**
 * Tasks
 */

app.task('default', function(cb) {
  // log out a time-stamped message for the target
  utils.logTask(app.name, ':target');

  // iterate over each "files" definition on the target
  async.each(target.files, function(files, next) {
    // extend "target" data onto files.data
    var data = extend(target.data, files.data);
    // render "src" files
    app.src(files.src, files.options)
      .pipe(app.renderFile(data))
      .pipe(app.dest(files.dest))
      .on('error', next)
      .on('finish', next);
  }, cb);
});

/**
 * Expose our instance of assemble
 */

module.exports = app;
