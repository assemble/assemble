'use strict';

var path = require('path');
var relative = require('relative');

module.exports = function(verb) {
  verb.helper('resolve', function (name) {
    var base = path.resolve(process.cwd(), 'node_modules', name);
    var pkg = require(path.join(base, 'package.json'));
    var cwd = path.join(base, pkg.main);

    var res = {};
    res.pkg = pkg;
    res.cwd = relative(cwd);
    res.dest = pkg.homepage;
    return res;
  });

  verb.task('readme', function () {
    verb.src('.verb.md')
      .pipe(verb.dest('.'));
  });

  verb.task('apidocs', function () {
    verb.src('docs/_verb/*.md')
      .pipe(verb.dest('docs'));
  });

  verb.task('default', ['readme', 'apidocs']);
};
