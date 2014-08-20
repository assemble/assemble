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

/**
 * Local modules
 */

var parseMatter = require('./parse-matter');
var parsePath = require('./parse-path');
var extendFile = require('./extend-file');


module.exports = function (obj, options) {
  debug('normalize-file', arguments);
  if (obj._normalized_) {
    return obj;
  }

  var opts = _.extend({}, options);
  var o = _.cloneDeep(obj);

  // Create an object with props from the assemble
  // cache and options.
  var cache = {};
  _.extend(cache, this.cache);
  _.extend(cache, this.options, options);
  _.extend(cache, options);

  var path = o.path || (o.data && o.data.path);
  var contents = new Buffer(o.content);
  var file = new File({path: path, contents: contents});

  // Omit properties that are already extended onto `file`
  o = _.omit(o, ['content', 'path']);

  // Merge file with any other props on `o`
  _.merge(file, o);

  // Merge in `src` and `dest` properties from the assemble
  // cache and options
  _.extend(file.src, props.getSrcProps(cache));
  _.extend(file.dest, props.getDestProps(cache));

  file = parsePath(file, opts.encoding, opts);
  file = parseMatter(file, opts.encoding, opts);
  file = extendFile(file, opts.encoding, opts);

  // Mark the file as `_normalized_`
  file._normalized_ = true;

  // Return the normalized file
  return file;
};
