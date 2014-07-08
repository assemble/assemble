'use strict';

// var gutil = require('gulp-util');
// var through = require('through2');
// var Handlebars = require('handlebars');
// var _ = require('lodash');

// module.exports = function assembleHandlebars(assemble) {
//   return function(options) {
//     options = options || {};
//     var data = options.data || options;
//     delete options.data;

//     return through.obj(function (file, encoding, callback) {
//       if (file.isNull()) {
//         this.push(file);
//         return callback();
//       }
//       if (file.isStream()) {
//         this.emit('error', new gutil.PluginError('assemble-template', 'Streaming not supported'));
//         return callback();
//       }
//       try {
//         data = _.extend({}, assemble.context, data, file.data);
//         var template = Handlebars.compile(file.contents.toString('utf8'));
//         var rendered = template(data);

//         file.contents = new Buffer(rendered);
//         file.path = gutil.replaceExtension(file.path, '.html');
//       } catch (err) {
//         this.emit('error', new gutil.PluginError('assemble-template', err));
//       }

//       this.push(file);
//       callback();
//     });
//   };
// };


var PluginError = require('gulp-util').PluginError;
var ms = require('map-stream');
var handlebars = require('../engines/handlebars');

module.exports = function assembleRemarked(options) {
  return function (options, data) {
    options = options || {};

    return ms(function (file, callback) {
      if (file.isNull()) {
        this.push(file);
        return callback();
      }
      if (file.isStream()) {
        this.emit('error', new PluginError('assemble-handlebars', 'Streaming not supported'));
        return callback();
      }

      function render(err, html) {
        if (err) {
          callback(err);
        } else {
          file.contents = new Buffer(html);
          callback(null, file);
        }
      }

      try {
        if (options.filepath) {
          handlebars(file.path, data, render);
        } else {
          handlebars.render(String(file.contents), data, render);
        }
      } catch (err) {
        callback(err);
      }

      // try {
      //   file.contents = new Buffer(handlebars(file.contents.toString('utf8')));
      // } catch (err) {
      //   this.emit('error', new PluginError('assemble-handlebars', err));
      // }

      // this.push(file);
      // callback();
    });
  };
};
