/**
 * isUndefined
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
module.exports = function (value) {
  return value === 'undefined' || Utils.toString.call(value) === '[object Function]' || (value.hash != null);
};