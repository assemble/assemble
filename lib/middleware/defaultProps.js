/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Add default properties to the file object.
 *
 * @param {Object} `assemble` the current assemble instance
 * @api public
 * @name  defaultProps
 */

module.exports = function (assemble) {
  return function parse (file, next) {
    var tutils = require('template-utils');
    tutils.defaultProps(file);
  };
};