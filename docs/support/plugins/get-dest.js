'use strict';

var first = require('get-first');

/**
 * Returns a plugin function that adds a `dest` getter/setter
 * to views.
 */

module.exports = function() {
  return function getDest(view) {
    if (this.isRegistered('view-get-dest')) return;
    if (!view.isView && !view.isItem) return getDest;

    Object.defineProperty(view, 'dest', {
      configurable: true,
      set: function(dest) {
        this.data.dest = dest;
      },
      get: function() {
        return first(this.data, ['permalink', 'dest']);
      }
    });
  };
};
