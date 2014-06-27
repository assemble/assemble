var assemble = require('../..');
var handlebars = require('assemble-handlebars')(assemble);
var parser = require('assemble-parser')(assemble);
var options = require('load-options')('.assemblerc.yml', {cwd: __dirname});

assemble.config({
  options: options,
  // options: opts({templates: 'test/fixtures'}),
  site: {
    title: 'This is a title'
  }
});


assemble.plugin(require('assemble-core'));
assemble.data('package.json');

console.log(assemble);

//console.log('partials', assemble.partials());
//console.log();
//console.log('layouts', assemble.layouts());
//console.log();
//console.log('options', assemble.context);
//console.log();

assemble.task('site', function () {
  console.log('running site');
  assemble.src('test/fixtures/pages/*.hbs')
    .pipe(parser())
    .pipe(handlebars())
    .pipe(assemble.dest('test/actual/'));
});

assemble.task('site');

