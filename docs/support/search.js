'use strict';

var path = require('path');
var utils = require('./utils');

function Search(app) {
  if (!(this instanceof Search)) {
    return new Search(app);
  }
  utils.diff('starting search');
  this.app = app;
  this.idx = utils.lunr(function() {
    this.ref('url');
    this.field('title', { boost: 10 });
    this.field('description', { boost: 100 });
    this.field('tags', { boost: 1000 });
    this.field('category', { boost: 1000 });
    this.field('body');
  });
  this.files = {};
}

Search.prototype.collect = function() {
  utils.diff('starting search collect');

  var self = this;
  return utils.through.obj(function(file, enc, cb) {
    // cache pre-rendered content
    self.files[file.key] = {
      key: file.key,
      title: file.data.title || file.key,
      tags: [],
      category: file.data.category || 'docs',
      description: file.data.description || file.data.title || file.key,
      body: file.content
    };

    cb(null, file);
  }, function(cb) {
    utils.diff('finished search collect');
    cb();
  });
};

Search.prototype.generate = function(options) {
  utils.diff('starting search generate');

  var self = this;
  var app = this.app;
  var opts = utils.extend({}, options);

  return utils.through.obj(function(file, enc, cb) {
    if (!self.files[file.key]) {
      return cb(null, file);
    }

    // update properties on cache
    self.files[file.key].url = file.dest;
    self.idx.add(self.files[file.key]);

    cb(null, file);
  }, function(cb) {
    var fp = opts.base ? path.join(opts.base, 'search.json') : 'search.json';
    var content = JSON.stringify({files: self.files, idx: self.idx});
    var file = app.view({path: fp, content: content});

    utils.diff('finished search generate');
    this.push(file);
    cb();
  });
};

module.exports = Search;
