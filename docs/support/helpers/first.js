'use strict';

module.exports = function(arr, options) {
  if (!arr || Array.isArray(arr) === false) {
    return options.fn ? options.fn(item ? item : {}) : (item ? item : {});
  }
  var item = arr.length ? arr[0] : {};
  return options.fn ? options.fn(item) : item;
}
