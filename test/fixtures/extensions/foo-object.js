
var _ = require('lodash');

module.exports = function (Assemble) {
  _.extend(Assemble.prototype, {
    fooObject: function () {
      return 'boop-object';
    }
  });
  Assemble.prototype['foo-object'] = 'bar-object';
};