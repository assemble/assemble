'use strict';

var util = require('util');
var AssembleLayouts = require('assemble-layouts');

/**
 * ## Layouts
 */

var Layouts = module.exports = function Layouts(options) {
  AssembleLayouts.call(this, options);
};

util.inherits(Layouts, AssembleLayouts);