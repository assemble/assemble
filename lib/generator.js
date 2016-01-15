'use strict';

module.exports = function(assemble, base, env) {
  assemble.task('default', function(cb) {
    console.log('assemble generator > default');
    cb();
  });
};
