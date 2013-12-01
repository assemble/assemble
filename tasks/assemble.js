/*
 * Assemble
 * https://github.com/assemble/
 *
 * Copyright (c) 2013 Upstage
 * Licensed under the MIT license.
 */

var assemble = require('../lib/assemble');

module.exports = function(grunt) {

  grunt.registerMultiTask('assemble', 'Compile template files with specified engines', function() {
    var done = this.async();
    var self = this;
    done();
  });

};
