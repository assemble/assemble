'use strict';

var path = require('path');
var parseFilepath = require('parse-filepath');

/**
 * Extend the `file` object with Assemble's default
 * template properties.
 */

module.exports = function(file, next) {
  defaultProps(file);
  next();
};

/**
 * Setup default properties and objects on a template object.
 *
 * @name  defaultProps
 * @param  {Object} `template` Template Object to add properties to.
 * @api public
 */

function defaultProps (template) {
  // add default properties to template object
  defaults(template, ['data', 'options', 'locals'], {});
  // add default path properties to template object
  parsePath(template);
  // add default engine to template.options
  defaults(template.options, ['engine'], template.ext);
};

function parsePath(template) {
  defaults(template.data, ['src', 'dest'], {});
  // add default `src` and `dest` properties to the `data` object
  if (typeof template.path !== 'string') {
    throw new Error('[template-utils] parsePath expects `.path` to be a string');
  }
  template.ext = template.ext || path.extname(template.path);

  // Parse `template.path` into an object
  var parsed = parseFilepath(template.path);
  for (var prop in parsed) {
    if (Boolean(parsed[prop])) {
      defaults(template.data.src, [prop], parsed[prop]);
      defaults(template.data.dest, [prop], parsed[prop]);
    }
  }
  defaults(template.data.src, ['path'], template.path);
  defaults(template.data.dest, ['path'], template.data.src.path);
  defaults(template.data.dest, ['ext'], parsed.extname);
}

function defaults(o, props, fallback) {
  if (o == null) {
    throw new Error('template-utils.defaults() expects an object.');
  }
  var len = props.length;
  var i = 0;

  while (len--) {
    var prop = props[i++];
    o[prop] = o[prop] || fallback;
  }
}
