/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */


var bar = function(msg) {
  return '<!-- foo -->\n<!-- ' + msg + ' -->';
};

module.exports.bar = bar;
