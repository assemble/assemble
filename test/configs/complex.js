'use strict';

var path = require('path');
var assemble = require('assembletemp');
var marked = require('marked');
var concat = require('assemble-concat');
var template = require('assemble-template')(assemble);


var upper = function (str) {
  return str.toUpperCase();
};

var include = function (filepath) {
  return require('fs').readFileSync(filepath, 'utf8');
};

var md = function(filepath) {
  var str = include(filepath).replace(/markdown/, 'HTML');
  return marked(str);
};

var fn = function(filepath) {
  return require(path.resolve(filepath));
};

var shout = function (msg) {
  console.log(msg);
  return console.log(msg.toUpperCase());
};


assemble.use(fn('test/fixtures/aaa.json'));
assemble.use('assemble-use');


// Any of these work
assemble.data('package.json');
assemble.data({upper: function(foo) {
  return foo + 1;
}});


assemble.data({fez: 'bang', aaa: 'bbb'});
assemble.data({beep: '<%= upper(fez) %>'});


assemble.task('template', function () {
  assemble.data({});
  assemble.src('test/fixtures/*.md')
    .pipe(template({name: 'Jon'}))
    .pipe(assemble.dest('test/actual'));
});


assemble.task('js', function () {
  assemble.data({});
  assemble.src('*.js')
    .pipe(concat('all.js'))
    .pipe(assemble.dest('test/actual'));
  assemble.src('test/fixtures/*.html')
    .pipe(concat('all.html'))
    .pipe(assemble.dest('test/actual'));
});

assemble.task('default', ['template', 'js']);