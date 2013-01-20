/*
 * assemble
 * https://github.com/sellside/assemble
 *
 * Copyright (c) 2012 Brian Woodward
 * Licensed under the MIT license.
 */

(function(exports) {

  var Assemble = function(options){
    return this.init(options);
  };

  Assemble.prototype.init = function(options){
    return this;
  };

  exports.init = function(options){
    return new Assemble(options);
  };

}(typeof exports === 'object' && exports || this));
