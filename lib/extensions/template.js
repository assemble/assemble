/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var Template = require('template');

module.exports = function (Assemble) {
  Assemble.onCreate(Template);
  Assemble = Template.extend(Assemble.prototype);
  return Assemble;
};