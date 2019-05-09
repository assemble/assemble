'use strict';

var assemble = require('assemble');
var app = assemble();

app.task('default', function() {
  app.pages('templates/*.hbs');
  return app.toStream('pages')
    .pipe(app.renderFile())
    .pipe(app.dest('dist'));
});

module.exports = app;
