/* ==========================================================
 * Assemble
 * http://assemble.io
 *
 * Copyright (c) 2012 Upstage
 * Licensed under the MIT license.
 * https://github.com/assemble/assemble/blob/master/LICENSE-MIT
 * ========================================================== */

(function(exports) {

  var _ = require('lodash'),
      frontMatter = require('./frontMatter').FrontMatter;

  var frontMatterOptions = ['fromFile', 'filename', 'strict', 'schema'];

  var Preprocessor = function(engine) {
    this.init(engine);
    this.preprocessers = {};
  };

  Preprocessor.prototype.init = function(engine) {
    this.engine = engine;
  };

  Preprocessor.prototype.compile = function(string, options) {
    var opts = options || {};
    if(opts.preprocessers) {
      if(toString.call(opts.preprocessers) !== '[object Array]') {
        opts.preprocessers = [opts.preprocessers];
      }
      var i = 0, l = opts.preprocessers.length;
      var that = this;
      return opts.preprocessers[i++](string, options, function recurse(string, options) {
        if(i<l) {
          return opts.preprocessers[i++](string, options, recurse);
        } else {
          return that.engine.compile(string, options);
        }
      });
    }
    return this.engine.compile(string, options);
  };

  var YamlPreprocessor = function(name, callback) {
    return function(string, options, next) {
      var opts = _.extend({fromFile: false}, _.pick(options, frontMatterOptions));
      var output = frontMatter(opts).extract(string);
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

  exports.init = function(engine) {
    var preprocessor = new Preprocessor(engine);
    preprocessor.preprocessers.YamlPreprocessor = YamlPreprocessor;
    return preprocessor;
  };




}(typeof exports === 'object' && exports || this));
