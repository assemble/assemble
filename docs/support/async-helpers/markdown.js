'use strict';

var utils = require('../utils');
var markdown = require('helper-markdown');

module.exports = function (content, options, cb) {
  if (typeof content === 'string') {
    return cb(null, markdown.call(this, content, options));
  }

  if (typeof options === 'function') {
    cb = options;
    options = content;
  }

  var self = this;
  var engine = this.app.engine('hbs');
  var ctx = utils.merge({}, this.context);
  content = options.fn(ctx);

  engine.asyncHelpers.resolveIds(content, function(err, content) {
    if (err) return cb(err);
    cb(null, markdown.call(self, content, ctx, options));
  });
};
