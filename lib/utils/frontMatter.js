/* ==========================================================
 * lib/utils/frontMatter.js
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
      yaml   = require('js-yaml');

  var yamlOptions = ['filename', 'strict', 'schema'];

  var FrontMatter = function(options) {
    return this.init(options);
  };

  FrontMatter.prototype.init = function(options) {
    var defaults = {
      fromFile: true
    };

    this.options = _.extend(defaults, options);
    return this;
  };

  FrontMatter.prototype.extract = function(src) {

    var data = {
      originalContent: '',
      content: '',
      context: {}
    };

    if(this.options.fromFile) {
      if(!fs.existsSync(src)) {
        log('File: ' + src + ' not found.');
        return false;
      }

      // read in file
      data.originalContent = fs.readFileSync(src, 'utf8');
    } else {
      data.originalContent = src;
    }

    // find front matter
    if(data.originalContent.indexOf('---') !== 0) {
      data.content = data.originalContent;
      return data;
    }

    // end of yaml
    var eoy = data.originalContent.indexOf('---', 3);
    var yamlText = '';
    if(eoy === -1) {
      yamlText = data.originalContent;
    } else {
      yamlText = data.originalContent.substring(0, eoy);
    }

    try {
      data.context = _.extend(data.context, yaml.load(yamlText, _.pick(this.options, yamlOptions)));
    } catch(e) {
      log(e);
      return false;
    }

    data.content = data.originalContent.substring(eoy+3);
    return data;
  };

  exports.FrontMatter = function(options) {
    return new FrontMatter(options);
  };

}(typeof exports === 'object' && exports || this));
