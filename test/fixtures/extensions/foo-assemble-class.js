
module.exports = function (Assemble) {
  Assemble.prototype.fooAssembleClass = function () {
    return 'boop-assemble-class';
  };
  Assemble.prototype['foo-assemble-class'] = 'bar-assemble-class';
};
