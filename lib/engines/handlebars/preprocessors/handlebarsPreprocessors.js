/* ==========================================================
 * handlebarsPreprocessors.js
 * 
 * Assemble
 * http://assemble.io
 *
 * Copyright (c) 2012 Upstage
 * Licensed under the MIT license.
 * https://github.com/assemble/assemble/blob/master/LICENSE-MIT
 * ========================================================== */

(function(exports) {

  var frontMatter = require('../../../utils/frontMatter').FrontMatter({fromFile: false});

  var Preprocessor = function(Handlebars) {
    this.init(Handlebars);
    this.preprocessers = {};
  };

  Preprocessor.prototype.init = function(Handlebars) {

    var origHandlebarsCompile = Handlebars.compile;

    Handlebars.compile = function(string, options) {

      if (typeof string !== 'string') {
        throw new Handlebars.Exception("You must pass a string to Handlebars.compile. You passed " + string);
      }

      var opts = options || {};

      if(opts.preprocessers) {
        if(toString.call(opts.preprocessers) !== '[object Array]') {
          opts.preprocessers = [opts.preprocessers];
        }
        var i = 0, l = opts.preprocessers.length;
        return opts.preprocessers[i++](string, options, function recurse(string, options) {
          if(i<l) {
            return opts.preprocessers[i++](string, options, recurse);
          } else {
            return origHandlebarsCompile.call(this, string, options);
          }
        });
      }

      return origHandlebarsCompile.call(this, string, options);
    };

  };

  var YamlPreprocessor = function(name, callback) {
    return function(string, options, next) {
      var output = frontMatter.extract(string);
      var rtn = {name: name, output: output};
      if(callback) {
        callback(rtn);
      }
      return next(output.content, options);
    };
  };

  Preprocessor.prototype.getPreprocessor = function(name) {
    for(var k in this.preprocessers) {
      if(k === name) {
        return this.preprocessers[k];
      }
    }
    return null;
  };

  exports.init = function(Handlebars) {
    var preprocessor = new Preprocessor(Handlebars);
    preprocessor.preprocessers.YamlPreprocessor = YamlPreprocessor;
    return preprocessor;
  };




}(typeof exports === 'object' && exports || this));
