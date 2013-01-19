(function(exports) {

  var fs   = require('fs'),
      log  = console.log,
      _    = require('lodash'),
      path = require('path'),
      util = require('util'),
      yaml  = require('js-yaml');


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

    var originalContent = '';

    if(this.options.fromFile) {
      if(!fs.existsSync(src)) {
        console.log('File: ' + src + ' not found.');
        return false;
      }

      // read in file
      originalContent = fs.readFileSync(src, 'utf8');
    } else {
      originalContent = src;
    }

    // find front matter
    if(!(originalContent.indexOf('---') === 0)) {
      return {}
    }

    // end of yaml
    var eoy = originalContent.indexOf('---', 3);
    var yamlText = '';
    if(eoy === -1) {
      yamlText = originalContent;
    } else {
      yamlText = originalContent.substring(0, eoy);
    }

    var data = {};
    console.log('\n');
    try {
      data = _.extend(data, yaml.load(yamlText));
    } catch(e) {
      console.log(e);
      return false;
    }

    return {
      context: data,
      originalContent: originalContent,
      content: originalContent.substring(eoy+3)
    };

  };

  exports.init = function(options) {
    return new FrontMatter(options);
  };

}(typeof exports === 'object' && exports || this));
