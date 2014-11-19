

var _ = require('lodash');

var Foo = function () {
  this['foo-class'] = 'bar-class';
}

Foo.prototype.fooClass = function () {
  return 'boop-class';
};

module.exports = function (Assemble) {
  Assemble.onCreate(Foo);
  _.extend(Assemble.prototype, Foo.prototype);
};