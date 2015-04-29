'use strict';

var chalk = require('chalk');
var tildify = require('tildify');

/**
 * Show a diff comparison of pre- and post-render content.
 */

module.exports = function diff_(assemble) {
    console.log(assemble.get('argv'))
  return function (file, next) {
    var diff = assemble.get('argv.diff');

    if (!diff) return next();
    console.log();
    console.log('- end -');
    console.log('---------------------------------------------------------------');
    console.log(tildify(file.path));
    console.log();

    if (file.content === '') {
      console.log(chalk.gray('  no content.'));
    } else if (file.content === file.orig) {
      console.log(chalk.gray('  content is unchanged.'));
    } else {
      assemble.diff(file.orig, file.content, 'diffLines');
    }
    next();
  };
};
