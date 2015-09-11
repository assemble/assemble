var async = require('async');
var through = require('through2');
var assemble = require('./');
var app = assemble();
app.engine('txt', require('engine-handlebars'));

var Scaffold = require('scaffold');

var one = new Scaffold({
  cwd: 'test/fixtures/scaffolds',
  destBase: 'one',
  files: [
    {src: '*.txt', dest: 'a'},
    {src: '*.txt', dest: 'b'},
    {src: '*.txt', dest: 'c'},
    {src: '*.md', dest: 'md', data: {name: 'Brian'}},
  ]
});

var two = new Scaffold({
  cwd: 'test/fixtures/scaffolds',
  destBase: 'two',
  files: [
    {src: '*.txt', dest: 'a'},
    {src: '*.txt', dest: 'b'},
    {src: '*.txt', dest: 'c'},
    {src: '*.md', dest: 'md', data: {name: 'Jon'}},
  ]
});

app.task('one', function (cb) {
  async.each(one.files, function (file, next) {
    app.process(file)
      .on('error', next)
      .on('end', next);
  }, cb);
});

app.task('two', function (cb) {
  async.each(two.files, function (file, next) {
    app.process(file)
      .on('error', next)
      .on('end', next);
  }, cb);
});

app.task('default', ['one', 'two']);

app.run('default', function (err) {
  if (err) console.error(err);
});
