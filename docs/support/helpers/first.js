'use strict';

module.exports = function(list, options) {
  if (!list || !list.isList) {
    return options.fn ? options.fn({}) : {};
  }
  var items = list.items;
  var item = items.length ? items[0] : {};
  return options.fn ? options.fn(item) : item;
}
