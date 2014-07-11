var through = require('through2');
var es = require('event-stream');
var utils = require('../utils.js');
var fs = require('vinyl-fs');
var template = require('template');
var _ = require('lodash');

module.exports = function(dest, options, data) {
  var extendFile = through.obj(function (file, enc, callback) {
    data = _.extend({}, data, file.data);
    this.push(file);
    callback();
  });

  // Resolve template strings.
  var ctx = _.extend({}, options, this.context, data);
  dest = template(dest, ctx);

  return es.pipe.apply(es, utils.arrayify([
    extendFile,
    this.collection(options),
    this.use('render:before'),
    this.render(options, data),
    this.use('render:after'),
    this.use('last'),
    fs.dest(dest, options)
  ]));
};