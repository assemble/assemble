'use strict';

var path = require('path');
var assemble = require('assembletemp');
var remarked = require('remarked');
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
  return remarked(str);
};

var fn = function(filepath) {
  return require(path.resolve(filepath));
};

var shout = function (msg) {
  console.log(msg);
  return console.log(msg.toUpperCase());
};


site.use(fn('test/fixtures/aaa.json'));
site.use('assemble-use');


// Any of these work
site.data('package.json');
site.data({upper: function(foo) {
  return foo + 1;
}});


site.data({fez: 'bang', aaa: 'bbb'});
site.data({beep: '<%= upper(fez) %>'});


site.task('template', function () {
  site.data({});
  site.src('test/fixtures/*.md')
    .pipe(template({name: 'Jon'}))
    .pipe(site.dest('test/actual'));
});


site.task('js', function () {
  site.data({});
  site.src('*.js')
    .pipe(concat('all.js'))
    .pipe(site.dest('test/actual'));
  site.src('test/fixtures/*.html')
    .pipe(concat('all.html'))
    .pipe(site.dest('test/actual'));
});

site.task('default', ['template', 'js']);