'use strict';

/**
 * Getter/setter for the current working directory.
 *
 * ```js
 * console.log(app.cwd);
 * //=> /dev/foo/bar/
 * ```
 * Or set:
 *
 * ```js
 * app.cwd = 'foo';
 * ```
 */

module.exports = function cwd_(app) {
  var cwd = app.option('cwd') || process.cwd();

  Object.defineProperty(app, 'cwd', {
    get: function () {
      return cwd;
    },
    set: function (val) {
      cwd = val;
    }
  });
};
