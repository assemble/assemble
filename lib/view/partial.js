'use strict';

/**
 * Module dependencies.
 */

var path = require('path');
var _ = require('lodash');

/**
 * Local dependencies
 */

var Layout = require('./layout');

/**
 * ## .partials
 *
 * Return the partials in a format that engines understand
 *
 * **Example:**
 *
 * ```js
 * var partials = this.partials(assemble.partials);
 * ```
 * Results in:
 *
 * ```js
 * {
 *   'foo': 'this is a foo partial',
 *   'bar': 'this is a bar partial'
 * }
 * ```
 *
 * @param {Object} `partials` object of key => View objects to normalize
 * @param  {Function} `fn` renaming function to identify partial
 * @return {Object} The normalized partials object
 * @api private
 */

function partial (partials, fn) {
  fn = fn || function (key) {
    return path.basename(key, path.extname(key));
  };

  var results = {};
  var layouts = new Layout();

  // `name` is most likely a filepath
  _.forOwn(partials, function (partial, name) {

    // let partials use layouts
    if (!partial.layout) {
      var layout = layouts.get(partial.ext);
      partial.layout = layout && layout.flatten(partial);
    }

    // if a layout exists, use that, otherwise, use the partial.contents
    var contents = (partial.layout ? partial.layout.contents : partial.contents);
    results[fn(name)] = contents.toString();

  }.bind(this));
  return results;
};



/**
 * Expose `partial`
 */

module.exports = partial;