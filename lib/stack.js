'use strict';

/**
 * Module dependencies.
 */

var utils = require('assemble-utils');
var through = require('through2');
var es = require('event-stream');
var _ = require('lodash');

/**
 * Local dependencies
 */

var drafts = require('./plugins/drafts');
var render = require('template-render');
var path = require('./plugins/path');
var init = require('template-init');
var ext = require('./plugins/ext');
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
    }
    if (app.enabled(name + ' plugin')) {
      acc = acc.concat(plugin);
    }
    return acc;
  }

  var arr = _.reduce(plugins, enabled, []);
  return utils.sessionify(es.pipe.apply(es, arr), session);
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
 * app.disable('src:drafts plugin');
 * ```
 */

exports.dest = function (dest, options) {
  var app = this;

  var srcOpts = session.get('src-opts') || {};
  var opts = _.extend({}, app.options, srcOpts, options);
  var locals = _.extend({}, opts.locals);

  return createStack(app, {
    'dest:paths': path.call(app, dest, options),
    'dest:render': render(app)(opts, locals),
    'dest:ext': ext.call(app, options),
  });
};
