'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var extend = _.extend;
var resolve = require('resolve-dep');
var utils = require('../utils');


/**
 * Resolve and load helpers defined on the config.
 *
 * @param  {Object} `options`
 * @return {[type]}
 */

function helpers (value) {
  switch(utils.typeOf(value)) {
    case 'object':
      return helpers.fromObj(value);
    case 'string':
      return helpers.fromStr(value);
    case 'function':
      return helpers.fromFn(value);
    case 'array':
      return helpers.fromArr(value);
    default:
      return {};
  }
}


/**
 * Resolve the `name`d npm module name, filepath or glob pattern, passing
 * the results to `helpers()`.
 *
 * @method `fromStr`
 * @param {String} `name` NPM module name, file path or glob pattern to resolve.
 * @return {Object} object of key/value helper pairs.
 * @api private
 */

helpers.fromStr = function (str) {
  var resolved = resolve(str);
  var results = {};

  resolved.forEach(function (filepath) {
    var helper = require(filepath);
    if (utils.typeOf(helper) === 'object') {
      extend(results, helper);
    } else {
      extend(results, helpers(helper));
    }
  });
  return results;
};


/**
 * noop, just return the `helper` object.
 *
 * @method `fromObj`
 * @param {Object} `helper` A helper object.
 * @param {Object} object of key/value helper pairs.
 * @api private
 */

helpers.fromObj = function (helper) {
  return helper;
};


/**
 * Execute the function and if the result is an Object, return that
 * Otherwise pass the results back through `helpers`
 *
 * @method `fromFn`
 * @param {Function} `fn`
 * @return {Object} object of key/value helper pairs.
 * @api private
 */

helpers.fromFn = function (fn) {
  var helper = fn.call();
  if (utils.typeOf(helper) === 'object') {
    return helper;
  }
  return helpers(helper);
};


/**
 * Loop over the array and call `helpers` for each item.
 *
 * @method `fromArr`
 * @param {Array} `arr`
 * @return {Object} object of key/value helper pairs.
 * @api private
 */

helpers.fromArr = function (arr) {
  var res = {};
  _.unique(arr).forEach(function (helper) {
    extend(res, helpers(helper));
  });
  return res;
};


/**
 * Export `helpers`
 */

module.exports = helpers;