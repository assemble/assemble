'use strict';

/**
 * Module dependencies.
 */

var Vinyl = require('vinyl');

function File(file, options) {
  Vinyl.call(this, file);
  this.parse(file, options);
}


File.prototype.parse = function(file, options) {
  //
};



function Files () {}


Files.prototype.set = function(file, options) {
  //
};