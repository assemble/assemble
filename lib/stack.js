'use strict';

/**
 * Module dependencies.
 */

var vfs = require('vinyl-fs');
var drafts = require('gulp-drafts');
var reduce = require('object.reduce');
var sessionify = require('sessionify');
var init = require('template-init');
var render = require('template-render');
var merge = require('mixin-deep');
var through = require('through2');
var es = require('event-stream');

/**
 * Local dependencies
 */

var plugins = require('./plugins');
var session = require('./session');

/**
 * Default `src` plugins to run.
 *
 * To disable a plugin:
 *
 * ```js
 * app.disable('src:foo plugin');
 * ```
 */

exports.src = function (app, glob, opts) {
  opts = merge({}, app.options, opts);
  session.set('src', opts);

  if (app.enabled('minimal config') || opts.minimal) {
    return vfs.src(glob, opts);
  }

  return createStack(app, {
    'src:vfs': vfs.src(glob, opts),
    'src:init': init(app)(opts),
    'src:drafts': drafts.call(app, opts)
  });
};

/**
 * Default `dest` plugins to run.
 *
 * To disable a plugin:
 *
 * ```js
 * app.disable('dest:bar plugin');
 * ```
 */

exports.dest = function (app, dest, opts) {
  var srcOpts = session.get('src') || {};
  opts = merge({}, srcOpts, opts);

  if (app.enabled('minimal config') || opts.minimal) {
    return vfs.dest(dest, opts);
  }

  return createStack(app, {
    'dest:paths': plugins.dest.call(app, dest, opts),
    'dest:render': render(app)(opts.locals, opts),
    'dest:vfs': vfs.dest(dest, opts)
  });
};

/**
 * Create the default plugin stack based on user settings.
 *
 * Disable a plugin by passing the name of the plugin + ` plugin`
 * to `app.disable()`,
 *
 * **Example:**
 *
 * ```js
 * app.disable('src:foo plugin');
 * app.disable('src:bar plugin');
 * ```
 */

function createStack(app, plugins) {
  if (app.enabled('minimal config')) {
    var res = es.pipe.apply(es, []);
    return sessionify(res, session, app);
  }

  function enabled(acc, val, name) {
    if (val == null) {
      acc.push(through.obj());
    }
    if (app.enabled(name + ' plugin')) {
      acc.push(val);
    }
    return acc;
  }
  var arr = reduce(plugins, enabled, []);
  var res = es.pipe.apply(es, arr);
  return sessionify(res, session, app);
}
