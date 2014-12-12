'use strict';

/**
 * Module dependencies
 */

var _ = require('lodash');

/**
 * Omit properties that should only be passed to globbing libraries.
 * This is used on non-glob options before passing the options
 * to a glob lib. Sad that we need to do this.
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

