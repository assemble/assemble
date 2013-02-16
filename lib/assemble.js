/*
 * assemble
 * https://github.com/sellside/assemble
 *
 * Copyright (c) 2012 Brian Woodward
 * Licensed under the MIT license.
 */

(function(exports) {

  var utils = require('./utils.js');

  var Assemble = function(options){
    return this.init(options);
  };

  Assemble.prototype.init = function(options){
    return this;
  };

  exports.init = function(options){
    return new Assemble(options);
  };

  exports.FrontMatter = function(options) {
    return utils.FrontMatter(options);
  };

  exports.Markdown = function(options) {
    return utils.Markdown(options);
  };

}(typeof exports === 'object' && exports || this));
