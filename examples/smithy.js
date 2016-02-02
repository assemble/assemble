'use strict';

var fs = require('fs');
var path = require('path');
var toFile = require('to-file');
var extname = require('gulp-extname');
var runtimes = require('composer-runtimes');
var matter = require('parser-front-matter');
var assemble = require('..');

module.exports = function smithy(dir, filepath) {
  var app = assemble();
  app.use(runtimes());

  app.engine('*', require('engine-handlebars'));
  app.onLoad(/./, function (view, next) {
    matter.parse(view, next);
  });

  app.create('files', {engine: '*'});
  toViews(dir, filepath, function (fp, opts) {
    app.files.addView(toFile(fp, opts));
  });

  app.task('default', function() {
    return app.toStream('files')
      .pipe(app.renderFile('*'))
      .pipe(extname())
      .pipe(app.dest('build'))
  });

  app.build = app.build.bind(app, 'default');
  return app;
};

function toViews(dir, filepath, fn) {
  var base = path.resolve(dir, filepath || 'src');
  var files = fs.readdirSync(base);

  var len = files.length, i = -1;
  while (++i < len) {
    var name = files[i];
    var fp = path.resolve(base, name);
    var stat = fs.lstatSync(fp);
    if (stat.isFile()) {
      fn(fp, {base: base, stat: stat});
    }
  }
}
