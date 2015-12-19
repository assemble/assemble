'use strict';

/**
 * Module dependencies.
 */

var drafts = require('gulp-drafts');
var reduce = require('object.reduce');
var extend = require('extend-shallow');
var sessionify = require('sessionify');
var init = require('template-init');
var render = require('template-render');
var through = require('through2');
var es = require('event-stream');

/**
 * Local dependencies
 */

var path = require('./plugins/paths');
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

function createStack(assemble, plugins) {
  if (assemble.enabled('minimal config')) {
    return es.pipe.apply(es, []);
  }

  function enabled(acc, plugin, name) {
    if (plugin == null) {
      acc.push(through.obj());
    }
    if (assemble.enabled(name + ' plugin')) {
      acc = acc.concat(plugin);
    }
    return acc;
  }

  var arr = reduce(plugins, enabled, []);
  var res = es.pipe.apply(es, arr);
  return sessionify(res, session);
}

/**
 * Default `src` plugins to run.
 *
 * To disable a plugin:
 *
 * ```js
 * assemble.disable('src:drafts plugin');
 * ```
 */

exports.src = function (glob, options) {
  var assemble = this;
  var opts = extend({}, assemble.options, options);
  session.set('src-opts', opts);

  return createStack(assemble, {
    'src:init': init(assemble)(opts),
    'src:drafts': drafts.call(assemble, opts)
  });
};

/**
 * Default `dest` plugins to run.
 *
 * To disable a plugin:
 *
 * ```js
 * assemble.disable('dest:render plugin');
 * ```
 */

exports.dest = function (dest, options) {
  var assemble = this;

  var srcOpts = session.get('src-opts') || {};
  var opts = extend({}, assemble.options, srcOpts, options);
  var locals = extend({}, opts.locals);

  return createStack(assemble, {
    'dest:paths': path.call(assemble, dest, options),
    'dest:render': render(assemble)(opts, locals)
  });
};
