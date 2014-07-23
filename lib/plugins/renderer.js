'use strict';

/**
 * Module dependencies.
 */

var gutil = require('gulp-util');
var through = require('through2');
var _ = require('lodash');

module.exports = function rendererPlugin(assemble) {
  var View = assemble.get('view');

  return function renderer(options, locals) {
    return through.obj(function (file, encoding, callback) {
      assemble.set('encoding', encoding || 'utf8');

      if (file.isNull()) {
        this.push(file);
        return callback();
      }

      if (file.isStream()) {
        this.emit('error', new gutil.PluginError('assemble-renderer', 'Streaming is not supported with engines.'));
        return callback();
      }

      var data = _.extend({}, assemble.get(), locals, file.data, file.locals);
      var view = new View(file, assemble, options);
      var stream = this;

      function render(err, file, ext) {
        if (err) {
          callback(err);
        } else {
          file.ext = options.ext || ext || assemble.get('ext');
          file.path = gutil.replaceExtension(file.path, file.ext);
          stream.push(file);
          callback();
        }
      }

      var opts = _.extend({}, options, {ext: assemble.get('ext')}, data);
      try {
        view.render(opts, render);
      } catch (err) {
        this.emit('error', new gutil.PluginError('assemble-renderer', err));
        return callback();
      }
    });
  };
};


// Kerouac.prototype.render = function (name, options, fn, file) {
//   file = file !== undefined ? file : true;

//   // support callback function as second arg
//   if ('function' === typeof options) {
//     fn = options;
//     options = {};
//   }

//   if (file) {
//     var opts = {},
//       cache = this._cache,
//       engines = this._engines,
//       layout;

//     // merge app.locals
//     utils.merge(opts, this.locals);

//     // merge options._locals
//     if (options._locals) {
//       utils.merge(opts, options._locals);
//     }

//     // merge options
//     utils.merge(opts, options);

//     // set .cache unless explicitly provided
//     opts.cache = null === opts.cache ? this.enabled('layout cache') : opts.cache;

//     // primed cache
//     if (opts.cache) {
//       layout = cache[name];
//     }

//     // layout
//     if (!layout) {
//       layout = new Layout(name, {
//         defaultEngine: this.get('layout engine'),
//         root: this.get('layouts'),
//         engines: engines
//       });
//       if (!layout.path) {
//         var err = new Error('Failed to lookup layout "' + name + '"');
//         err.layout = layout;
//         return fn(err);
//       }

//       // prime the cache
//       if (opts.cache) {
//         cache[name] = layout;
//       }
//     }

//     // render
//     try {
//       layout.render(opts, fn);
//     } catch (err) {
//       fn(err);
//     }
//   } else {
//     var opts = {};

//     // TODO: Respect default layout engine setting.
//     var ext = options.engine || 'md';
//     if ('.' !== ext[0]) {
//       ext = '.' + ext;
//     }
//     var engine = this._engines[ext];
//     if (!engine) {
//       this.engine(ext, require(ext.slice(1)));
//       engine = this._engines[ext];
//     }
//     if (engine.options) {
//       utils.merge(opts, engine.options);
//     }
//     utils.merge(opts, options);
//     if ('function' !== typeof engine.render) {
//       throw new Error('string rendering not supported by "' + ext + '" engine');
//     }
//     engine.render(name, opts, fn);
//   }
// };
