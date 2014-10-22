/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';
var arrayify = require('arrayify-compact');

module.exports = {


  /**
   * Add the extension methods to the Assemble Class and prototype.
   *
   * @param  {Object} `Assemble` Constructor function of the Assemble Class
   * @api private
   */

  extend: function (Assemble) {

    // setup a constructor stack that can be used when creating a new instance of Assemble
    Assemble.constructorStack = [];


    /**
     * Pass in a constructor function to be called when a new instance of Assemble is created.
     *
     * ```js
     * module.exports = function (Assemble) {
     *   var Foo = function (options) {
     *     this.fooOptions = options || {};
     *   };
     *   Assemble.onCreate(Foo);
     *   _.extend(Assemble.prototype, Foo.prototype);
     * };
     * ```
     *
     * @param  {Function} `constructor` Constructor function to be called when an instance of Assemble is created.
     * @api public
     */

    Assemble.onCreate = function (constructor) {
      Assemble.constructorStack.push(constructor);
    };


    /**
     * Add an extension to the Assemble prototype.
     *
     * ```js
     * Assemble.extension(function (Assemble) {
     *   Assemble.prototype.intro = function (name) {
     *     return 'Hello, ' + name + '!';
     *   };
     * });
     *
     * var assemble = new Assemble();
     * console.log(assemble.intro('Brian'));
     * //=> Hello, Brian!
     * ```
     *
     * @param  {Function} `fn` Function that will be called and passed the Assemble constructor
     * @return {Function} Assemble constructor function, can be used for chaining
     * @api public
     */

    Assemble.extension = function (fn) {
      Assemble = fn(Assemble) || Assemble;
      return Assemble;
    };


    /**
     * Add an extension to an instance of assemble.
     *
     * ```js
     * var assemble = new Assemble();
     * assemble.extension(function (assemble) {
     *   assemble.intro = function (name) {
     *     return 'Hello, ' + name + '!';
     *   };
     * });
     * console.log(assemble.intro('Brian'));
     * //=> Hello, Brian!
     * ```
     *
     * @param  {Function} `fn` Function that will be called and passed the instance of assemble
     * @return {Object} Assemble instance, can be used for chaining
     * @api public
     */

    Assemble.prototype.extension = function (fn) {
      fn(this);
      return this;
    };

  },


  /**
   * Initialize assemble with the list of extensions
   *
   * @param  {Function|Object} `assemble` Either the Assemble constructor or an assemble instance.
   * @param  {Array} `extensions` Array of extensions to require in and add to assemble.
   * @api private
   */

  init: function (assemble, extensions) {
    extensions = arrayify(extensions || []);
    var len = extensions.length;
    var i = 0;
    while(len--) {
      assemble.extension(require(extensions[i++]));
    }
  }
};
