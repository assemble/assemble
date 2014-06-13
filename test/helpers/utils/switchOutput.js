/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */
'use strict';


/**
 * switchOutput
 */
module.exports = function(ext, md, html) {
  var output;
  switch (ext) {
    case "":
    case ".md":
      output = md;
      break;
    case ".html":
    case ".htm":
      output = html;
  }
  return output;
};