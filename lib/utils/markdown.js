/* ==========================================================
 * lib/utils/markdown.js
 * 
 * Assemble
 * http://assemble.io
 *
 * Copyright (c) 2012 Upstage
 * Licensed under the MIT license.
 * https://github.com/assemble/assemble/blob/master/LICENSE-MIT
 * ========================================================== */

(function(exports) {

  var fs     = require('fs'),
      log    = console.log,
      _      = require('lodash'),
      marked = require('marked'),
      hljs   = require('highlight.js');


  /****************************************************************************
  * Some of the following code is from grunt-markdown
  * https://github.com/treasonx/grunt-markdown
  ****************************************************************************/

  var Markdown = function(options) {
    return this.init(options);
  };

  Markdown.prototype.init = function(options) {
    var defaults = {
      fromFile: true
    };

    this.options = _.extend(defaults, options);
    return this;
  };

  Markdown.prototype.read = function(src) {
    // read in a file and convert it to html using marked
    if(!fs.existsSync(src)) {
      log("File " + src + " not found.");
      return '';
    }

    var md = fs.readFileSync(src, 'utf8');
    return this.convert(md);
  };

  Markdown.prototype.convert = function(src) {

    // wrapLines function from grunt-markdown
    var codeLines = this.options.codeLines;
    var shouldWrap = false;
    if(codeLines && codeLines.before && codeLines.after) {
      shouldWrap = true;
    }

    var wrapLines = function(code) {
      var out = [];
      var before = codeLines.before;
      var after = codeLines.after;
      code = code.split('\n');
      code.forEach(function(line) {
        out.push(before+line+after);
      });
      return out.join('\n');
    };

    // highlighting function setup from grunt-markdown
    if(typeof this.options.highlight === 'string') {
      if(this.options.highlight === 'auto') {

        this.options.highlight = function(code) {
          var out = hljs.highlightAuto(code).value;
          if(shouldWrap) {
            out = wrapLines(out);
          }
          return out;
        };

      } else if (this.options.highlight === 'manual') {

        this.options.highlight = function(code, lang) {
          var out = code;
          try {
            code = hljs.highlight(lang, code).value;
          } catch(e) {
            out = hljs.highlightAuto(code).value;
          }
          if(shouldWrap) {
            out = wrapLines(out);
          }
          return out;
        };

      }
    }

    marked.setOptions(this.options);
    var html = marked(src);
    return html;
  };

  exports.Markdown = function(options) {
    return new Markdown(options);
  };

}(typeof exports === 'object' && exports || this));
