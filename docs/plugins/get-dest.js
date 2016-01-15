'use strict';

/**
 * Returns a plugin function that adds a `dest` getter/setter
 * to views.
 */

module.exports = function getDest() {
  return function fn(view) {
    if (!view.isView && !view.isItem) {
      return fn;
    }

    Object.defineProperty(view, 'dest', {
      configurable: true,
      set: function(dest) {
        this.data.dest = dest;
      },
      get: function() {
        if (this.data.permalink) {
          return this.data.permalink;
        }
        return this.data.dest;
      }
    });
  };
};
