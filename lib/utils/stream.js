'use strict';

var tutils = require('template-utils');
var _ = require('lodash');

/**
 * Add a collection of cached templates to a stream
 *
 * @param  {Object} `collection` Template collection in the form of `{key:value}` pairs.
 * @param  {Stream} `stream` Stream to push the files into
 */

module.exports = function pushToStream(collection, stream) {
  _.forIn(collection, function (file) {
    stream.push(tutils.toVinyl(file));
  });
};
