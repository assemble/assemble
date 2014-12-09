'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');
var es = require('event-stream');
var _ = require('lodash');

/**
 * Local dependencies
 */

var session = require('./session');
var init = require('./plugins/init');
var drafts = require('./plugins/drafts');
var renderer = require('./plugins/renderer');
var destPath = require('./plugins/dest-path');
var destExt = require('./plugins/dest-ext');


/**
 * Create the default plugin stack based on user settings.
 *
 * Disable a plugin by passing the name of the plugin + ` plugin`
 * to `app.disable()`,
 *
 * **Example:**
 *
 * ```js
 * app.disable('src:renderer plugin');
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
    }
    if (app.enabled(name + ' plugin')) {
      acc = acc.concat(plugin);
    }
    return acc;
  }

  var arr = _.reduce(plugins, enabled, []);
  return es.pipe.apply(es, arr);
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

exports.src = function (glob, options) {
  var app = this;
  var opts = _.extend({}, app.options, options);
  session.set('src-opts', opts);

  return createStack(app, {
    'src:init': init.call(app, opts),
    'src:drafts': drafts.call(app, opts)
  });
};


/**
 * Default `dest` plugins to run.
 *
 * To disable a plugin:
 *
 * ```js
 * app.disable('src:drafts plugin');
 * ```
 */

exports.dest = function (dest, options) {
  var app = this;

  var srcOpts = session.get('src-opts') || {};
  var opts = _.extend({}, app.options, srcOpts, options);
  var locals = _.extend({}, opts.locals);
  var isExtended = false;

  return createStack(app, {
    'dest:paths': destPath.call(app, dest, options),
    'dest:render': renderer.call(app, opts, locals),
    'dest:ext': destExt.call(app, dest, options),
  });
};
