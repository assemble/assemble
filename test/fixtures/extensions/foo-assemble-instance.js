
module.exports = function (assemble) {
  assemble.constructor.prototype.fooAssembleInstance = function () {
    return 'boop-assemble-instance';
  };
  assemble['foo-assemble-instance'] = 'bar-assemble-instance';
};