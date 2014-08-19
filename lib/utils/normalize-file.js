'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var path = require('path');
var debug = require('debug')('assemble:Template');
var File = require('vinyl');

/**
 * Local modules
 */

var parseMatter = require('./parse-matter');
var parsePath = require('./parse-path');
var extendFile = require('./extend-file');


module.exports = function (o, options) {
  debug('normalize-file', arguments);

  if (o._normalized_) {
    return o;
  }

  var opts = _.extend({}, options);

  var file = new File({
    path: o.path || (o.data && o.data.path),
    contents: new Buffer(o.content)
  });

  o = _.omit(o, ['content', 'path']);
  _.extend(file, o);

  file = parsePath(file, opts.encoding, opts);
  file = parseMatter(file, opts.encoding, opts);
  file = extendFile(file, opts.encoding, opts);

  file._normalized_ = true;
  return file;
};
