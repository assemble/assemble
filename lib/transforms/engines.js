'use strict';

/**
 * Register default engines:
 *
 *  - handlebars: registered to extensions defined on `options.engineExts`
 *  - noop: passes through any file not associated with an engine
 *
 * Initialized in the `init` transform.
 */

module.exports = function engines(assemble) {
  var options = assemble.option('engineExts');

  // handlebars
  assemble.engine(options, require('engine-assemble'), {
    layoutDelims: ['{%', '%}']
  });

  // noop
  assemble.engine('*', function noop(str, opts, cb) {
    if (typeof opts === 'function') cb = opts;
    cb(null,  str);
  });
}
