'use strict';

module.exports = function(collection, filter, options) {
  if (filter && typeof filter === 'object') {
    options = filter;
    filter = function(item) {
      return true;
    };
  }

  this.app.debug.helper('list helper "%s", "%j"', collection, options);
  var List = this.app.List;

  if (typeof collection === 'string') {
    collection = this.app[collection];
  }

  var list = new List(collection);
  var items = list.items;
  if (typeof filter === 'function') {
    items = list.items.filter(filter);
  }

  // render block helper with list as context
  if (typeof options.fn === 'function') {
    return options.fn(items);
  }

  // return items when not used as a block helper
  return items;
}
