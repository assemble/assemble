/*
 * Assemble
 * https://github.com/assemble/
 *
 * Copyright (c) 2013 Upstage
 * Licensed under the MIT license.
 */


(function(exports) {

  var fs = require('fs'),
      path = require('path'),
      _ = require('lodash');

  var Processor = function(grunt, options) {
    return this.init(grunt, options);
  };

  Processor.prototype.init = function(grunt, options) {
    this.grunt = grunt;
    this.options = options;
    return this;
  };

  Processor.prototype.process = function(callback) {
    // get any page data from pages

    // build site map

    if(typeof callback === 'Function') {
      callback(null, results);
    }
  };

  exports.PageProcessor = function(grunt, options) {
    return new Processor(grunt, options);
  };

}(typeof exports === 'object' && exports || this));
