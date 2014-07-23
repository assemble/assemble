'use strict';

/**
 * Module dependencies
 */

var fs = require('fs');
var path = require('path');
var isAbsolute = require('is-absolute');


function Layout(name, options) {
  var engines = options.engines;
  var defaultEngine = options.defaultEngine;

  this.name = name;
  this.root = options.root;

  var ext = this.ext = path.extname(name);
  if (!ext) {
    name += ext = this.ext = '.' + defaultEngine;
  }

  this.engine = engines[ext] || (engines[ext] = require(ext.slice(1)));
  this.path = this.lookup(name);
}


Layout.prototype.lookup = function (filepath) {
  var ext = this.ext;
  // <filepath>.<engine>
  if (!isAbsolute(filepath)) {
    filepath = path.join(this.root, filepath);
  }
  if (fs.existsSync(filepath)) {
    return filepath;
  }
  // <filepath>/index.<engine>
  filepath = path.join(path.dirname(filepath), path.basename(filepath, ext), 'index' + ext);
  if (fs.existsSync(filepath)) {
    return filepath;
  }
};


Layout.prototype.render = function (options, fn) {
  var engine = this.engine;
  // ejs-locals compat
  if (this.ext === '.ejs') {
    options._layout = options.layout;
    delete options.layout;
  }
  if ('function' !== typeof engine.renderFile) {
    throw new Error('file rendering not supported by "' + this.ext + '" engine');
  }
  engine.renderFile(this.path, options, fn);
};



module.exports = Layout;