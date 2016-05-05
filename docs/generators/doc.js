'use strict';
var path = require('path');
var opts = {alias: {tmpl: 't'}, default: {tmpl: 'page'}};
var argv = require('minimist')(process.argv.slice(2), opts);
var debug = require('debug')('generate:doc');

var utils = require('./lib/utils');
var rename = require('./lib/rename');
var files = require('./lib/files');

module.exports = function(app, base) {
  if (this.isRegistered('assemble-docs-generate-doc')) return;
  debug('initializing <%s>, from <%s>', __filename, module.parent.id);

  /**
   * Register instance plugins
   */

  app
    .use(require('generate-defaults'))
    .use(require('generate-collections'))
    .use(utils.conflicts())
    .use(rename())
    .use(files());

  /**
   * Set options
   */

  app
    .option(base.options)
    .option(argv)
    .option({delims: ['<%', '%>']})
    .option('renameFile', function(file) {
      file.stem = 'page';
      return file;
    });

  /**
   * Register pipeline plugins
   */

  app.plugin('rename', rename);

  /**
   * Register helpers
   */

  app.helper('camelcase', require('camel-case'));
  app.helper('relative', function(dest) {
    return (dest !== this.app.cwd) ? path.relative(dest, this.app.cwd) : './';
  });

  var cwd = process.cwd();

  var defaultDest = 'templates/pages';
  function setDefaultDest(dest) {
    return function*() {
      defaultDest = dest;
    };
  }

  var defaultName = 'page';
  function setDefaultName(name) {
    return function*() {
      defaultName = name;
    };
  }

  app.task('templates', function*() {
    app.debug('loading templates');
    app.templates(['./scaffolds/pages/*.hbs'], { cwd: cwd });
    app.debug('loaded templates');
  });

  app.task('dest', function(cb) {
    app.question('dest', 'Destination directory?', {default: defaultDest});
    app.ask('dest', {save: false}, function(err, answers) {
      if (err) return cb(err);
      app.option('dest', answers.dest);
      cb();
    });
  });

  app.task('name', function(cb) {
    app.question('name', 'File name?', {default: defaultName});
    app.ask('name', {save: false}, function(err, answers) {
      if (err) return cb(err);
      defaultName = answers.name;
      cb();
    });
  });

  function deps(arr) {
    return (arr || []).concat(['templates', 'name', 'dest']);
  }

  app.task('files', deps(), function(cb) {
    app.chooseFiles(app.options, cb);
  });

  app.task('page', deps([
    setDefaultDest('templates/pages'),
    setDefaultName('page')
  ]), function() {
    app.debug('generating default page file');
    var dest = app.option('dest') || app.cwd;
    console.log('dest', dest);
    var page = defaultName || 'page';

    // add `options` to the context
    app.data({ options: app.options });

    return app.toStream('templates')
      .on('data', console.log)
      .pipe(filter('page'))
      .pipe(app.renderFile('*'))
      .pipe(app.renameFile(function(file) {
        file.path = path.join(cwd, dest, page + '.hbs');
        console.log(file.path);
        return file;
      }))
      .pipe(app.conflicts(dest))
      .pipe(app.dest(dest));
  });

  app.task('default', ['page'], function*() {
    console.log('doc:default');
  });
};

function filter(pattern, options) {
  var isMatch = utils.match.matcher(pattern, options);

  return utils.through.obj(function(file, enc, next) {
    if (file.isNull()) {
      next();
      return;
    }

    console.log(isMatch(file));
    if (isMatch(file)) {
      next(null, file);
    } else {
      next();
    }
  });
}
