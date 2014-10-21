/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';
var arrayify = require('arrayify-compact');

module.exports = {
  extend: function (Assemble) {
    // setup a constructor stack that can be used when creating a new instance of Assemble
    Assemble.constructorStack = [];
    Assemble.onCreate = function (constructor) {
      Assemble.constructorStack.push(constructor);
    };

    Assemble.extension = function (fn) {
      Assemble = fn(Assemble) || Assemble;
      return Assemble;
    };
    
    Assemble.prototype.extension = function (fn) {
      fn(this);
      return this;
    };
  },
  init: function (assemble, extensions) {
    extensions = arrayify(extensions || []);
    var len = extensions.length;
    var i = 0;
    while(len--) {
      assemble.extension(require(extensions[i++]));
    }
  }
};