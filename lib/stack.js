'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var vfs = require('vinyl-fs');
var drafts = require('gulp-drafts');
var reduce = require('object.reduce');
var sessionify = require('sessionify');
var init = require('template-init');
var render = require('template-render');
var through = require('through2');
var es = require('event-stream');

/**
 * Local dependencies
 */

var plugins = require('./plugins');
var session = require('./session');

/**
 * Create the default plugin stack based on user settings.
 *
 * Disable a plugin by passing the name of the plugin + ` plugin`
 * to `app.disable()`,
 *
 * **Example:**
 *
 * ```js
 * app.disable('src:render plugin');
 * app.disable('src:drafts plugin');
 * ```
 */

function createStack(app, plugins) {
  if (app.enabled('minimal config')) {
    return es.pipe.apply(es, []);
  }

  function enabled(acc, plugin, name) {
    if (plugin == null) {
      acc.push(through.obj());
      return acc;
    }
    if (app.enabled(name + ' plugin')) {
      acc.push(plugin);
    }
    return acc;
  }

  var arr = _.reduce(plugins, enabled, []);
  var res = es.pipe.apply(es, arr);
  return sessionify(res, session, app);
}

/**
 * Default `src` plugins to run.
 *
 * To disable a plugin:
 *
 * ```js
 * app.disable('src:drafts plugin');
 * ```
 */

exports.src = function (app, glob, opts) {
  opts = _.merge({}, app.options, opts);
  session.set('src', opts);

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
 * app.disable('dest:render plugin');
 * ```
 */

exports.dest = function (app, dest, opts) {
  var srcOpts = session.get('src') || {};
  opts = _.merge({}, app.options, srcOpts, opts);

  return createStack(app, {
    'dest:paths': plugins.dest.call(app, dest, opts.locals, opts),
    'dest:render': render(app)(opts.locals, opts),
    'dest:vfs': vfs.dest(dest, opts)
  });
};

