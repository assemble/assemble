/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var hljs = require('highlight.js');

module.exports = function (Assemble) {

  /**
   * Private method to register default syntax highlighter.
   *
   * @api private
   */

  Assemble.prototype.defaultHighlighter = function() {
    this.highlight(function (code, lang) {
      if (lang) {
        return hljs.highlight(lang, code).value;
      }
      return hljs.highlightAuto(code).value;
    });
  };

  /**
   * Register a function for syntax highlighting.
   *
   * By default, Assemble uses highlight.js for syntax highlighting.  It's not
   * necessary to register another function unless you want to override the default.
   *
   * **Examples:**
   *
   * ```js
   * assemble.highlight(function(code, lang) {
   *   if (lang) {
   *     return hljs.highlight(lang, code).value;
   *   }
   *   return hljs.highlightAuto(code).value;
   * });
   * ```
   *
   * @param {Function} `fn`
   * @return {Object} `Assemble` to enable chaining.
   * @api public
   */

  Assemble.prototype.highlight = function (code, lang) {
    if (typeof code === 'function') {
      this.highlighter = code;
      return this;
    }

    if (this.highlighter) {
      return this.highlighter(code, lang);
    }
    return code;
  };

  return Assemble;
};
