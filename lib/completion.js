/*!
 * Borrowed from gulp
 * https://github.com/gulpjs/gulp
 *
 * Copyright (c) 2014 Fractal <contact@wearefractal.com>
 * Licensed under the MIT license.
 * https://github.com/gulpjs/gulp/blob/master/LICENSE
 */

'use strict';

/**
 * Module dependencies.
 */

var fs = require('fs');
var path = require('path');

module.exports = function (name) {
  if (typeof name !== 'string') {
    throw new Error('Missing completion type');
  }
  var file = path.join(__dirname, '../completion', name);
  try {
    console.log(fs.readFileSync(file, 'utf8'));
    process.exit(0);
  } catch (err) {
    console.log('echo "assemble auto-completion rules for \'' + name + '\' not found"');
    process.exit(5);
  }
};