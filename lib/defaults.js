'use strict';

/**
 * Module dependencies.
 */

var es = require('event-stream');
var through = require('through2');
var _ = require('lodash');

/**
 * Local dependencies
 */

var session = require('./session');
var init = require('./plugins/init');
// var buffer = require('./plugins/buffer');
// var drafts = require('./plugins/drafts');
// var routes = require('./plugins/routes');
// var parser = require('./plugins/parser');
// var assets = require('./plugins/assets');
var renderer = require('./plugins/renderer');
// var paginate = require('./plugins/paginate');
// var destPath = require('./plugins/dest-path');
// var collections = require('./plugins/collection');


/**
 * Create the default plugin stack based on user settings.
 *
 * Disable a plugin by passing the name of the plugin + ` plugin`
 * to `assemble.disable()`,
 *
 * **Example:**
 *
 * ```js
 * assemble.disable('renderer plugin');
 * assemble.disable('drafts plugin');
 * ```
 *
 * In the future we may not include any default plugins,
 * but we're deferring that decision until the API is set.
 */

function createStack(assemble, plugins) {
  if (assemble.enabled('minimal config')) {
    return es.pipe.apply(es, []);
  }

  var pipeline = [];
  Object.keys(plugins).forEach(function(plugin) {
    var fn = plugins[plugin];
    if (assemble.enabled(plugin + ' plugin')) {
      pipeline = pipeline.concat(fn);
    }
  });
  if (!pipeline.length) {
    pipeline = pipeline.concat([through.obj()]);
  }

  return es.pipe.apply(es, pipeline);
}


/**
 * Default `src` plugins to run.
 *
 * To disable a plugin:
 *
 * ```js
 * assemble.disable('drafts plugin');
 * ```
 */

exports.src = function (glob, options) {
  var assemble = this;
  var opts = _.extend({}, assemble.options, options);
  session.set('src-opts', opts);

  function extend(opts) {
    return through.obj(function (file, enc, callback) {
      if (file.isNull()) {
        this.push(file);
        return callback();
      }

      // Extend or create the `locals` property on the file object
      file.locals = _.extend({}, opts, opts.locals, file.locals);
      this.push(file);
      callback();
    });
  }

  return createStack(assemble, {
    'init'      : init.call(assemble, opts)
    // 'src-routes': routes.call(assemble, opts),
    // 'buffer'    : buffer.call(assemble, opts),
    // 'extend src': extend.call(assemble, opts),
    // 'parser'    : parser.call(assemble, opts),
    // 'drafts'    : drafts.call(assemble, opts),
    // 'assets'    : assets.call(assemble, opts),
    // 'paginate'  : paginate.call(assemble, opts)
  });
};


/**
 * Default `dest` plugins to run.
 *
 * To disable a plugin:
 *
 * ```js
 * assemble.disable('drafts plugin');
 * ```
 */

exports.dest = function (dest, options) {
  var assemble = this;

  var srcOpts = session.get('src-opts') || {};
  options = _.extend({}, assemble.options, srcOpts, options);
  var locals = _.extend({}, options, options.locals);
  var isExtended = false;

  // TODO!
  function extend() {
    return through.obj(function (file, enc, callback) {
      if (file.isNull()) {
        this.push(file);
        return callback();
      }

      // `file.locals` is created in src
      if (!isExtended && file.locals) {
        isExtended = true;
        _.extend(locals, file.locals || {});
      }

      this.push(file);
      callback();
    });
  }

  return createStack(assemble, {
    // 'extend dest': extend.call(assemble, options),
    // 'collections': collections.call(assemble, options),
    // 'dest'       : destPath.call(assemble, dest, options),
    // 'dest-routes': routes.call(assemble, options),
    'render'     : renderer.call(assemble, options, locals)
  });
};
