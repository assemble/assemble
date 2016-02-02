
var smithy = require('../smithy');
var questions = require('base-questions');
var store = require('base-store');

/**
 * Build.
 */

smithy(__dirname)
  .use(ask(function(err, answers) {
    if (err) throw err;
    this.data(answers);
    this.build(function(err) {
      if (err) throw err;
    });
  }));

/**
 * Customize the base-questions plugin
 */

function ask(cb) {
  return function(app) {
    app.use(store('smithy'))
      .use(questions())
      .ask(function(err, answers) {
        if (err) return cb(err);

        cb.call(app, null, answers);
      });

    app.asyncHelper('ask', function(key, options, cb) {
      app.questions.options.force = true;
      app.ask(key, function(err, res) {
        if (err) return cb(err);
        cb(null, res[key]);
      });
    });
  };
}
