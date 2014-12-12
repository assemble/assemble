'use strict';

/**
 * Module dependencies
 */

var _ = require('lodash');

/**
 * Omit properties that should only be passed to globbing libraries.
 *
 *   - `cache` defaults to {}
 *   - `cwd` defaults to `process.cwd()`
 *   - `debug`
 *   - `dot`
 *   - `globDebug`
 *   - `mark`
 *   - `matchBase`
 *   - `maxDepth` defaults to 1000
 *   - `maxLength` defaults to Infinity
 *   - `nocase`
 *   - `noglobstar`
 *   - `nomount`
 *   - `nonull`
 *   - `nosort`
 *   - `nounique`
 *   - `root`
 *   - `silent`
 *   - `stat`
 *   - `stateCache` deaults to {}
 *   - `strict`
 *   - `sync`
 *
 * @return {Array}
 * @api private
 */

exports.omitGlobProps = function omitGlobProps(obj) {
  return _.omit(obj, [
    // 'cache',
    // 'cwd',
    'debug',
    'dot',
    'globDebug',
    'mark',
    'matchBase',
    'maxDepth',
    'maxLength',
    'nocase',
    'noglobstar',
    'nomount',
    'nonull',
    'nosort',
    'nounique',
    'root',
    'silent',
    'stat',
    'stateCache',
    'strict',
    // 'sync'
  ]);
};

