var assemble = require('../assemble');
var parser = require('../assemble/vendor/assemble-parser')(assemble);
var handlebars = require('../assemble/vendor/verb-handlebars')(assemble);
var opts = require('load-options');

assemble.config({
  options: opts({templates: 'src/templates'}),
  site: {
    title: 'This is a title'
  }
});

//console.log('partials', assemble.partials());
//console.log();
//console.log('layouts', assemble.layouts());
//console.log();
//console.log('options', assemble.context);
//console.log();


assemble.task('site', function () {
  console.log('running site');
  assemble.src('src/templates/pages/*.hbs')
    .pipe(parser())
    .pipe(handlebars())
    .pipe(assemble.dest('dist/'));
});

assemble.start('site');