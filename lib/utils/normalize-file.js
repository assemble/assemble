'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var path = require('path');
var debug = require('debug')('assemble:normalize-file');
var File = require('vinyl');
var props = require('./props');
var utils = require('./');
var merge = _.merge;

/**
 * Local modules
 */

var parseMatter = require('./parse-matter');
var parsePath = require('./parse-path');
var extendFile = require('./extend-file');


module.exports = function (o, options) {
  debug('args', arguments);
  var assemble = this;

  if (o._normalized_) {
    return o;
  }

  var opts = merge({}, options);

  var path = o.path || (o.data && o.data.path);
  var contents = new Buffer(o.content);
  var file = new File({path: path, contents: contents});

  // Omit properties that are already extended onto `file`
  o = _.omit(o, ['content', 'path']);

  // Merge file with any other props on `o`
  merge(file, o);

  file = parsePath(file, opts.encoding, opts);
  file = parseMatter(file, opts.encoding, opts);
  file = extendFile(file, opts.encoding, opts);

  var src = props.mergeSrcProps(assemble, options);
  var dest = props.mergeDestProps(assemble, options);

  // Merge in `src` and `dest` objects
  file.src = merge({}, src, file.src);
  file.dest = merge({}, dest, file.dest);

  // Mark the file as `_normalized_`
  file._normalized_ = true;

  // Return the normalized file
  return file;
};
