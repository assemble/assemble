'use strict';

var engine = require('engine-assemble');

module.exports = function engines(assemble) {
  // default handlebars engine
  assemble.engine(assemble.option('engineExts'), engine, {
    layoutDelims: ['{%', '%}'],
    destExt: '.html'
  });

  // noop engine
  assemble.engine('*', function noop(str, opts, cb) {
    if (typeof opts === 'function') cb = opts;
    cb(null,  str);
  });
}
