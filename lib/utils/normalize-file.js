'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var fs = require('fs');
var debug = require('debug')('assemble:Template');
var File = require('vinyl');

/**
 * Local modules
 */

var parseMatter = require('./parse-matter');
var parsePath = require('./parse-path');
var extendFile = require('./extend-file');
var utils = require('./');


module.exports = function (obj, options) {
  debug('normalize-file', arguments);
  var opts = _.extend({}, options);

  var file = new File({
    path: obj.path || (obj.data && obj.data.path),
    contents: new Buffer(obj.content)
  });

  obj = _.omit(obj, ['content', 'path']);
  _.extend(file, obj);

  file = parsePath(file, opts.encoding, opts);
  file = parseMatter(file, opts.encoding, opts);
  file = extendFile(file, opts.encoding, opts);

  return file;
};
