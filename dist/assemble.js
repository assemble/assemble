/*! assemble - v0.1.0 - 2012-09-23
* https://github.com/sellside/assemble
* Copyright (c) 2012 Brian Woodward; Licensed MIT */

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
