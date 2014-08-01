// 'use strict';

// /**
//  * Module dependencies.
//  */

// var gutil = require('gulp-util');
// var through = require('through2');
// var Router = require('router/lib/router');
// var _ = require('lodash');


// module.exports = function routesPlugin(options) {
//   var assemble = this;
//   var opts = _.extend({}, assemble.options, options);
//   var router = opts.router || assemble._router;

//   return through.obj(function (file, encoding, callback) {
//     if (file.isNull()) {
//       this.push(file);
//       return callback();
//     }

//     if (file.isStream()) {
//       this.emit('error', new gutil.PluginError('assemble.route()', 'Streaming not supported'));
//       return callback();
//     }

//     var stream = this;

//     try {
//       // run middleware
//       router.dispatch(file, function (err) {
//         if (err) {
//           stream.emit('error', new gutil.PluginError('assemble.route()', err));
//           callback();
//         } else {
//           stream.push(file);
//           callback();
//         }
//       });
//     } catch (ex) {
//       stream.emit('error', new gutil.PluginError('assemble.router() - dispatch', ex));
//       callback();
//     }
//   });
// };

