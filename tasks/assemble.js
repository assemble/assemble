/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014-2015 Jon Schlinkert, Brian Woodward.
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  grunt.registerMultiTask('assemble', 'Compile template files with specified engines', function() {
    var done = this.async();
    var msg = [
      'WARNING!!!',
      '',
      'Use `grunt-assemble` with `grunt` instead of `assemble`.',
      '',
      'Install:',
      '  `npm i grunt-assemble -save-dev`',
      '  `grunt.loadNpmTask(\'grunt-assemble\');`',
      ''
    ].join('\n');

    console.log(format(msg, 80, '*'));
    return done(false);

    function format (msg, len, border) {
      var repeat = require('repeat-string');
      var longest = require('longest');
      var wrap = require('word-wrap');
      var chalk = require('chalk');

      // wrap the text down to the length size
      var txt = wrap(msg, {
        width: len - 4,
        indent: ' ',
        newline: ' \n '
      });

      // find the length of the longest line
      var lines = txt.split('\n');
      var max = longest(lines).length;
      max = (max > len ? max : len);

      // make the top and bottom borders
      var end = repeat(border, max + 2);

      // prepare the loop
      var res = end + '\n', i = 0;
      len = lines.length;
      while (len--) {
        // use the max line length to pad each line and show borders
        var line = lines[i++];
        var llen = line.length;
        res += border + line + repeat(' ', max - llen) + border + '\n';
      }
      return chalk.red(res + end);
    }
  });
};
