'use strict';

var file = require('fs-utils');


var engine = module.exports;
engine.cache = {};

engine.render = function (str, options, fn) {
  if (typeof options === 'function') {
    fn = options;
    options = {};
  }

  // cache requires .filename
  if (options.cache && !options.filename) {
    return fn(new Error('the "filename" option is required for caching'));
  }

  try {
    var filepath = options.filename;
    var rendered = options.cache ? engine.cache[filepath] || (engine.cache[filepath] = str) : str;

    fn(null, rendered);
  } catch (err) {
    fn(err);
  }
};

engine.renderFile = function (filepath, options, fn) {
  if (typeof options === 'function') {
    fn = options;
    options = {};
  }

  try {
    options.filename = filepath;
    var str;

    if (options.cache) {
      str = engine.cache[filepath] || (engine.cache[filepath] = file.readFileSync(filepath));
    } else {
      str = file.readFileSync(filepath);
    }

    engine.render(str, options, fn);
  } catch (err) {
    fn(err);
  }
};
