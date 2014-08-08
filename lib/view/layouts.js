/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

var _ = require('lodash');
var Layouts = require('layouts');

var Layout = function (options) {
  this.options = options || {};
  this.instance = null;
};

Layout.prototype.init = function(options) {
  var opts = ['delims', 'tag', 'cache', 'extend', 'sep', 'flags'];
  _.extend(this.options, _.pick(options || {}, opts));
  if (this.instance) {
    return;
  }
  this.instance = new Layouts(this.options);
};

_.forOwn(Layouts.prototype, function (fn, name) {
  Layout.prototype[name] = function () {
    this.init(_.last(arguments));
    return fn.apply(this.instance, arguments);
  };
});

module.exports = Layout;
