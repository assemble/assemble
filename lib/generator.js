'use strict';

var utils = require('./utils');
var cwd = process.cwd();

module.exports = function(app) {
  // use `base-questions` plugin for user prompts
  app.use(utils.questions());

  /**
   * Generate an `assemblefile.js`
   */

  app.task('new', function(cb) {
    app.src('./templates/assemblefile.js', {cwd: __dirname})
      .pipe(app.dest(cwd))
      .on('end', function() {
        console.log('created assemblefile.js');
        cb();
      });
  });

  /**
   * Asks if you want to generate an `assemblefile.js`
   */

  app.task('prompt-new', function(cb) {
    app.confirm('file', 'No assemblefile.js found, want to add one?');
    app.ask('file', {save: false}, function(err, answers) {
      if (err) return cb(err);
      if (answers.file) {
        app.build('new', cb);
      } else {
        console.log('Got it, stopping');
        process.exit();
      }
    });
  });

  app.task('default', ['prompt-new']);
};
