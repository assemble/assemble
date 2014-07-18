'use strict';

var _ = require('lodash');
var resolve = require('resolve-dep');

var utils = require('../utils');

function helpers (options) {
  options = options || {};
  options.helpers = options.helpers || [];

  var process = null;
  switch(utils.typeOf(options.helpers)) {
    case 'string':
      process = helpers.fromString;
      break;

    case 'function':
      process = helpers.fromFunction;
      break;

    case 'array':
      process = helpers.fromArray;
      break;

    case 'object':
      process = helpers.fromObject;
      break;

    default:
      process = null;
      break;
  }

  if (process) {
    return process(options.helpers);
  }
}


/**
 * ## .fromString
 *
 * Resolve the string as a glob pattern and load pass the results
 * through `helpers`
 *
 * @method `fromString`
 * @param {Function} `fn`
 * @param {Object} object of name/helper pairs
 * @api private
 */

helpers.fromString = function (str) {
  var resolved = resolve(str);
  var results = {};
  resolved.forEach(function (filepath) {
    var helper = require(filepath);
    if (utils.typeOf(helper) === 'object') {
      _.extend(results, helper);
    } else {
      _.extend(results, helpers({helpers: helper}));
    }
  });
  return results;
};


/**
 * ## .fromObject
 *
 * Just return the object
 *
 * @method `fromObject`
 * @param {Object} `obj`
 * @param {Object} object of name/helper pairs
 * @api private
 */

helpers.fromObject = function (obj) {
  return obj;
};

/**
 * ## .fromFunction
 *
 * Execute the function and if the result is an Object, return that
 * Otherwise pass the results back through `helpers`
 *
 * @method `fromFunction`
 * @param {Function} `fn`
 * @param {Object} object of name/helper pairs
 * @api private
 */

helpers.fromFunction = function (fn) {
  var results = fn.call();
  if (utils.typeOf(results) === 'object') {
    return results;
  }
  return helpers({helpers: results});
};


/**
 * ## .fromArray
 *
 * Loop over the array and call `helpers` for each item.
 *
 * @method `fromArray`
 * @param {Array} `arr`
 * @param {Object} object of name/helper pairs
 * @api private
 */

helpers.fromArray = function (arr) {
  var results = {};
  arr.forEach(function (item) {
    _.extend(results, helpers({helpers: item}));
  });
  return results;
};

module.exports = helpers;