/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */
'use strict';


/**
 * toString
 * @param  {[type]} val [description]
 * @return {[type]}     [description]
 */
module.exports = function(val) {
  /*jshint eqnull: true */

  if (val == null) {
    return "";
  } else {
    return val.toString();
  }
};