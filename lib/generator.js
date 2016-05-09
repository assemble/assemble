'use strict';

module.exports = function(app) {
  app.task('default', function(cb) {
    console.log(app.name, 'generator >', this.name);
    cb();
  });
};
