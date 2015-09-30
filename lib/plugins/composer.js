'use strict';

/**
 * Extend the Assemble prototype with composer methods
 */

module.exports = function () {
  var Composer = require('composer');

  return function (app) {
    Composer.call(this);
    app.visit('mixin', Composer.prototype);
  };
};
