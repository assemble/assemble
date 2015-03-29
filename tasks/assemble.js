/*!
 * Heads up
 */

'use strict';

module.exports = function(grunt) {
  grunt.registerMultiTask('assemble', 'Compile template files with specified engines', function() {
    var done = this.async();
    var chalk = require('chalk');
    var wrap = require('word-wrap');
    console.log();

    var msg = [
      chalk.red('HEADS UP!!! Assemble is now a standalone node.js library. To continue using assemble as a grunt plugin, please do the following:'),
      '',
      chalk.gray('    npm i grunt-assemble -save-dev'),
      '',
      chalk.red('Then use the the following in your project\'s Gruntfile.js:'),
      '',
      chalk.gray('    grunt.loadNpmTask(\'grunt-assemble\');'),
      ''
    ].join('\n');

    console.log(wrap(msg, 55));
    console.log();
    return done(false);
  });
};
