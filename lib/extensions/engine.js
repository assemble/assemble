/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var Engine = require('template');

module.exports = function (Assemble) {
  Assemble.onCreate(Engine);
  Assemble = Engine.extend(Assemble.prototype);
  return Assemble;
};