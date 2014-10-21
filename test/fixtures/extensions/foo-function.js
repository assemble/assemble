
module.exports = function (Assemble) {
  Assemble.prototype.fooFunction = function () {
    return 'boop-function';
  };
  Assemble.prototype['foo-function'] = 'bar-function';
};