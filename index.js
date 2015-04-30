'use strict';

/**
 * Module dependencies
 */

var diff = require('diff');
var chalk = require('chalk');
var Template = require('template');
var toVinyl = require('to-vinyl');
var Task = require('orchestrator');
var vfs = require('vinyl-fs');
var _ = require('lodash');

var session = require('./lib/session');
var stack = require('./lib/stack');
var utils = require('./lib/utils');
var init = require('./lib/init');

/**
 * Initialize `Assemble`
 *
 * @param {Object} `context`
 * @api private
 */

function Assemble() {
  Template.apply(this, arguments);
  Task.apply(this, arguments);
  this.session = session;
  init(this);
}

_.extend(Assemble.prototype, Task.prototype);
Template.extend(Assemble.prototype);

/**
 * Initialize default configuration.
 */

Assemble.prototype.defaultOptions = function() {
  Assemble.__super__.defaultOptions.apply(this, arguments);
  this.disable('default routes');
};

/**
 * Glob patterns or filepaths to source files.
 *
 * ```js
 * assemble.src('src/*.hbs', {layout: 'default'});
 *
 * // usage in a task
 * assemble.task('site', function() {
 *   assemble.src('src/*.hbs', {layout: 'default'})
 *     .pipe(assemble.dest('dist'));
 * });
 * ```
 *
 * @param {String|Array} `glob` Glob patterns or file paths to source files.
 * @param {Object} `options` Options or locals to merge into the context and/or pass to `src` plugins
 * @api public
 */

Assemble.prototype.src = function (glob, opts) {
  opts = _.merge({}, this.options, opts);
  if (this.enabled('minimal config') || opts.minimal) {
    return vfs.src(glob, opts);
  }
  return stack.src(this, glob, opts);
};

/**
 * Specify a destination for processed files.
 *
 * ```js
 * assemble.dest('_gh_pages/', {ext: '.html'});
 * ```
 *
 * @param {String|Function} `dest` File path or rename function.
 * @param {Object} `options` Options or locals to merge into the context and/or pass to `dest` plugins
 * @api public
 */

Assemble.prototype.dest = function (dest, opts) {
  if (this.enabled('minimal config') || opts && opts.minimal) {
    return vfs.dest(dest, opts);
  }
  return stack.dest(this, dest, opts);
};

/**
 * Copy a `glob` of files to the specified `dest`.
 *
 * ```js
 * assemble.copy('assets/**', 'dist/');
 *
 * // usage in a task
 * assemble.task('copy-assets', function() {
 *   return assemble.copy('assets/**', 'dist/');
 * });
 * ```
 *
 * @param  {String|Array} `glob`
 * @param  {String|Function} `dest`
 * @return {Stream} Stream, to continue processing if necessary.
 * @api public
 */

Assemble.prototype.copy = function(glob, dest, opts) {
  return vfs.src(glob, opts).pipe(vfs.dest(dest, opts));
};

/**
 * Define an assemble task. (read more about [tasks](./docs/tasks.md))
 *
 * ```js
 * assemble.task('default', function() {
 *   assemble.src('templates/*.hbs')
 *     .pipe(assemble.dest('dist/'));
 * });
 * ```
 *
 * @param {String} `name` Task name
 * @param {Function} `fn`
 * @api public
 */

Assemble.prototype.task = Assemble.prototype.add;

/**
 * Get the id from the current task. Used in plugins to get
 * the current session.
 *
 * ```js
 * var id = assemble.getTask();
 * assemble.views[id];
 * ```
 *
 * @return {String} `task` The currently running task.
 * @api public
 */

Assemble.prototype.getTask = function() {
  var name = this.session.get('task');
  return typeof name === 'string'
    ? 'task_' + name
    : 'page';
};

/**
 * Get the collection name (inflection) of the given
 * template type.
 *
 * ```js
 * var collection = verb.getCollection('page');
 * // gets the `pages` collection
 * //=> {a: {}, b: {}, ...}
 * ```
 *
 * @return {String} `name` Singular name of the collection to get
 * @api public
 */

Assemble.prototype.getCollection = function(name) {
  var collection = this.inflections[name];
  return this.views[collection];
};

/**
 * Used in plugins to get a template from the current session.
 *
 * ```js
 * var views = app.getViews();
 * ```
 *
 * @return {String} `id` Pass the task-id from the current session.
 * @return {Object} `file` Vinyl file object. Must have an `id` property that matches the `id` of the session.
 * @api public
 */

Assemble.prototype.getViews = function() {
  return this.getCollection(this.getTask())
};

/**
 * Get a template (file) from the current session in a stream.
 *
 * ```js
 * var file = app.getSessionFile(file);
 * ```
 *
 * @return {Object} `file` Vinyl file object. Must have an `id` property that matches the `id` of the session.
 * @api public
 */

Assemble.prototype.getSessionFile = function(file) {
  return this.getViews()[file.id];
};

/**
 * Get a template from the current session, convert it to a vinyl
 * file, and push it into the stream.
 *
 * ```js
 * app.pushToStream(file);
 * ```
 *
 * @param {Stream} `stream` Vinyl stream
 * @param {String} `id` Get the session `id` using `app.getTask()`
 * @api public
 */

Assemble.prototype.pushToStream = function(id, stream) {
  return utils.pushToStream(this.getCollection(id), stream, toVinyl);
};

/**
 * `files` is a session-context-specific getter that
 * returns the collection of files from the current `task`.
 *
 * ```js
 * var files = assemble.files;
 * ```
 *
 * @name .files
 * @return {Object} Get the files from the current task.
 * @api public
 */

Object.defineProperty(Assemble.prototype, 'files', {
  configurable: true,
  enumerable: true,
  get: function () {
    return this.views[this.inflections[this.getTask()]];
  }
});

/**
 * Display a visual representation of the
 * difference between `a` and `b`
 */

Assemble.prototype.diff = function(a, b, method) {
  method = method || 'diffJson';
  a = a || this.env;
  b = b || this.cache.data;
  diff[method](a, b).forEach(function (res) {
    var color = chalk.gray;
    if (res.added) {
      color = chalk.green;
    }
    if (res.removed) {
      color = chalk.red;
    }
    process.stderr.write(color(res.value));
  });
  console.log('\n');
};

/**
 * Run an array of tasks.
 *
 * ```js
 * assemble.run(['foo', 'bar']);
 * ```
 *
 * @param {Array} `tasks`
 * @api private
 */

Assemble.prototype.run = function() {
  var tasks = arguments.length ? arguments : ['default'];
  this.start.apply(this, tasks);
};

/**
 * Wrapper around Task._runTask to enable `sessions`
 *
 * @param  {Object} `task` Task to run
 * @api private
 */

Assemble.prototype._runTask = function(task) {
  var assemble = this;
  assemble.session.run(function () {
    assemble.session.set('task', task.name);
    Task.prototype._runTask.call(assemble, task);
  });
};

/**
 * Rerun the specified task when a file changes.
 *
 * ```js
 * assemble.watch('docs/*.md', ['docs']);
 *
 * // usage in a task
 * assemble.task('watch', function() {
 *   assemble.watch('docs/*.md', ['docs']);
 * });
 * ```
 *
 * @param  {String|Array} `glob` Filepaths or glob patterns.
 * @param  {String} `options`
 * @param  {Function} `fn` Task(s) to watch.
 * @return {String}
 * @api public
 */

Assemble.prototype.watch = function(glob, opts, fn) {
  if (Array.isArray(opts) || typeof opts === 'function') {
    fn = opts; opts = null;
  }
  if (!Array.isArray(fn)) return vfs.watch(glob, opts, fn);
  return vfs.watch(glob, opts, function () {
    this.start.apply(this, fn);
  }.bind(this));
};

/**
 * Create a new instance of `Assemble`.
 *
 * ```js
 * assemble.init();
 * ```
 *
 * @api public
 */

Assemble.prototype.init = function () {
  return new Assemble();
};

/**
 * Expose `assemble`
 */

module.exports = new Assemble();
