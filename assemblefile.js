'use strict';

var red = require('ansi-red');
var path = require('path');
var extname = require('gulp-extname');
var through = require('through2');
var app = require('./');

// create a custom view-collection for docs
app.create('docs', {
  layout: 'markdown',
  renameKey: function (fp) {
    return path.basename(fp, path.extname(fp));
  }
});

app.create('recipes', {layout: 'recipe'});

// register helpers
app.helpers(require('./docs/src/helpers'));

// app.onLoad(/\.(hbs|md)$/, function (view, next) {
//   var parsed = view.parsePath();
//   view.permalink('all-the-same.html', parsed);
//   next();
// });

app.data({
  destBase: '_gh_pages/',
  assets: 'assets',
  links: [{
    dest: 'assemble',
    collection: 'docs',
    text: 'Assemble'
  }]
});

// load templates
app.task('load', function (done) {
  app.partials('docs/src/templates/partials/*.hbs');
  app.layouts('docs/src/templates/layouts/*.hbs');
  app.recipes('docs/recipes/*.md');
  // app.docs('docs/content/*.md');
  done();
});

app.task('docs', ['load'], function () {
  return app.src('docs/src/templates/*.hbs')
    // .on('error', console.error)
    // .pipe(app.toStream('docs'))
    // .pipe(app.toStream('recipes'))
    .pipe(app.renderFile())
    .pipe(extname())
    .pipe(app.dest(function (file) {
      file.base = file.dirname;
      return '_gh_pages/';
    }))

});

app.task('watch', ['docs'], function () {
  app.watch('docs/**/*.{md,hbs}', ['default']);
});

app.task('default', ['docs']);
app.run('default', function () {

})
