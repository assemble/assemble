'use strict';

/**
 * Module dependencies.
 */

var markdown = require('remarked');
var _ = require('lodash');

module.exports = function markdownParser (options) {
  options = _.extend({}, options);

  return function (file) {
    var str = file.contents.toString();
    file.contents = new Buffer(markdown(str, options));
    return file;
  };
};