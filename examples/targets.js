'use strict';

var async = require('async');
var through = require('through2');
var extend = require('extend-shallow');
var Target = require('expand-target');
var Scaffold = require('scaffold');
var assemble = require('..');
var app = assemble();

/**
 * Define a target (similar to a Grunt "target")
 */

var target = new Target({
  data: {title: 'My Site'},
  options: {
    cwd: 'test/fixtures/targets',
    destBase: 'test/actual/target',
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

app.task('default', function (cb) {
  console.log('generating target: one');
  async.each(target.files, function(files, next) {
    var data = extend(target.data, files.data);
    app.src(files.src, files.options)
      .pipe(app.renderFile(data))
      .pipe(app.dest(files.dest))
      .on('error', next)
      .on('end', next);
  }, cb);
});

/**
 * Run tasks
 */

app.build('default', function(err) {
  if (err) throw err;
  console.log('done!');
});
