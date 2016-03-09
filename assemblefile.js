'use strict';

var path = require('path');
var prettify = require('gulp-prettify');
var extname = require('gulp-extname');
var questions = require('base-questions');
var merge = require('mixin-deep');
var store = require('base-store');
var get = require('get-value');
var assemble = require('./');

/**
 * Create our assemble appplication
 */

var app = assemble();
app.use(store('assemble'));
app.use(questions());


// app.helpers(require('handlebars-helpers'));

/**
 * Customize how templates are stored. This changes the
 * key of each template, so it's easier to lookup later
 */

app.option('renameKey', function(fp) {
  return path.basename(fp, path.extname(fp));
});

/**
 * Create a custom view collection
 */

app.create('docs');

/**
 * Load helpers
 */

app.helpers('docs/helpers/*.js');
var asked = {};

app.asyncHelper('ask', function(name, locals, cb) {
  if (typeof locals === 'function') {
    cb = locals;
    locals = {};
  }

  var answers = merge({}, app.store.get('answers'), app.data('answers'));
  if (asked[name]) {
    var res = app.data('answers.' + name) || '';
    cb(null, res);
    return;
  }

  asked[name] = true;
  var data = merge({}, this.app.cache.data, this.context.view.data);
  var ctx = merge({}, this.context, locals, data);

  app.questions.on('ask', function(key, question, answers) {
    var val = app.store.get('answers.' + key);
    if (typeof val !== 'undefined') {
      question.answer.set(val);
      app.data('answers.' + key, val);
    }
  });

  app.questions.on('answer', function(key, answer, question) {
    var val = question.getAnswer();
    if (typeof val !== 'undefined') {
      app.store.set('answers.' + key, val);
      app.data('answers.' + key, val);
    }
  });

  app.ask(name, answers, function(err, answers) {
    if (err) return cb(err);

    var res = app.data('answers.' + name) || '';
    cb(null, res);
  });
});


/**
 * Load some "global" data
 */

app.data({
  site: {
    title: 'Assemble Docs'
  },
  destBase: '_gh_pages/',
  assets: 'assets',
  links: [{
    dest: 'assemble',
    collection: 'docs',
    text: 'Assemble'
  }]
});

/**
 * Middleware
 */

app.preLayout(/\/api\/.*\.md$/, function(view, next) {
  view.layout = 'body';
  next();
});

/**
 * Re-load templates when triggered by watch
 */

app.task('load', function(cb) {
  app.pages('docs/templates/pages/*.hbs');
  app.partials('docs/templates/partials/*.hbs');
  app.layouts('docs/templates/layouts/*.hbs');
  app.docs('./docs/src/api/*.md');
  cb();
});

/**
 * Building the assemble docs
 */

app.task('default', ['load'], function() {
  var pkg = require('./package');
  return app.toStream('pages')
    .on('err', console.log)
    .pipe(app.renderFile())
    .on('err', console.log)
    .pipe(prettify())
    .pipe(extname())
    .pipe(app.dest(function(file) {
      file.base = file.dirname;
      return '_gh_pages/en/v' + pkg.version;
    }))
});

/**
 * Watch files for changes
 */

app.task('watch', ['default'], function() {
  app.watch('docs/**/*.{md,hbs}', ['default']);
  console.log('watching docs templates');
});

/**
 * Expose the `app` instance
 */

module.exports = app;
