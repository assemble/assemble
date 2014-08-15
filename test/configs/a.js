'use strict';

var assemble = require('../..');
var handlebars = require('assemble-handlebars')(assemble);
var parser = require('assemble-parser')(assemble);
var options = require('load-options')('.assemblerc.yml', {cwd: __dirname});

site.config({
  options: options,
  // options: opts({templates: 'test/fixtures'}),
  site: {
    title: 'This is a title'
  }
});


site.plugin(require('assemble-core'));
site.data('package.json');

console.log(assemble);

//console.log('partials', site.partials());
//console.log();
//console.log('layouts', site.layouts());
//console.log();
//console.log('options', site.context);
//console.log();

site.task('site', function () {
  console.log('running site');
  site.src('test/fixtures/pages/*.hbs')
    .pipe(parser())
    .pipe(handlebars())
    .pipe(site.dest('test/actual/'));
});

site.task('site');

