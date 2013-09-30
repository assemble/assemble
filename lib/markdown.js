/**
 * Assemble Markdown
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */

// Node.js
var fs = require('fs');

// node_modules
var marked = require('marked');
var hljs   = require('highlight.js');
var grunt  = require('grunt');
var _      = grunt.util._;

// The module to be exported.
var markdown = module.exports = {};


markdown.init = function(opts) {
  opts = opts || {};
  this.options = _.extend({}, {fromFile: true}, opts);
  return this;
};


markdown.convert = function(src, opts) {
  if(opts) {this.init(opts);}
  if(typeof this.options.highlight === 'string') {
    if(this.options.highlight === 'auto') {
      this.options.highlight = function(code) {
        return hljs.highlightAuto(code).value;
      };
    } else if (this.options.highlight === 'manual') {
      this.options.highlight = function(code, lang) {
        try {
          code = hljs.highlight(lang, code).value;
        } catch(e) {
          code = hljs.highlightAuto(code).value;
        }
        return code;
      };
    }
  }

  marked.setOptions(this.options);
  return marked(src);
};


markdown.read = function(src, opts) {
  if(opts) {this.init(opts);}
  // Verify that the markdown file exists.
  if(!grunt.file.exists(src)) {
    console.log("File " + src + " not found.");
    return '';
  }
  // Convert markdown to HTML
  return this.convert(grunt.file.read(src));
};



