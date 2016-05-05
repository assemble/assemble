'use strict';

module.exports = function(app, base) {
  app.option(base.options);

  app.use(require('generate-collections'));
  app.use(require('generate-defaults'));

  app.register('doc', require('./generators/doc'));

  app.task('default', function*() {
    console.log('default');
  });
};
