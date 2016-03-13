'use strict';

module.exports = function(collection, options) {
  this.app.debug.helper('list helper "%s", "%j"', collection, options);
  var List = this.app.List;

  if (typeof collection === 'string') {
    collection = this.app[collection];
  }

  var list = new List(collection);

  // render block helper with list as context
  if (typeof options.fn === 'function') {
    return options.fn(list);
  }

  // return list when not used as a block helper
  return list;
}
