'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');
var path = require('path');
var _ = require('lodash');
var matter = require('gray-matter');
var session = require('../session');
var File = require('vinyl');

function toVinyl (value) {
  var file = new File({
    contents: new Buffer(value.content),
    path: value.path,
  });

  file.options = value.options || (value.options = {});
  file.locals = value.locals || (value.locals = {});
  file.data = value.data || (value.data = {});
  file.ext = value.ext;
  return file;
}

module.exports = function initPlugin(options) {

  var assemble = this;
  var opts = _.extend({}, this.options, options);

  var loader = function (file, next) {
    var key = path.basename(file.path, path.extname(file.path));
    var obj = {};
    obj[key] = file;
    next(null, obj);
  };

  var fileType = '__task__' + session.get('task name');
  session.set('file type', fileType);
  assemble.create(fileType, { isRenderable: true }, [loader]);


  return through.obj(function (vinyl, encoding, cb) {

    var file = matter(vinyl.contents.toString());

    file.options = {};
    file.locals = {};
    file.path = vinyl.path;
    file.ext = path.extname(file.path);
    file.options.engine = file.ext;

    // Load files as templates
    assemble[fileType + 's'](file, cb);

  }, function (cb) {
    var stream = this;

    _.forIn(assemble.cache[fileType + 's'], function (value) {
      value = toVinyl(value);
      stream.push(value);
    });

    cb();

  });
};
