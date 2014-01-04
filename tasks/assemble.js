/*
 * Assemble
 * https://github.com/assemble/
 *
 * Copyright (c) 2013 Upstage
 * Licensed under the MIT license.
 */

var assemble = require('../lib/assemble');

module.exports = function (grunt) {

  grunt.registerMultiTask('assemble', 'Compile template files with specified engines', function () {
    var done = this.async();
    var self = this;

    // create an assembly line instance
    var assembleOptions = {
      source: 'grunt',
      data: assemble.utils.grunt.mapData(self, assemble.defaults, grunt),
      files: assemble.utils.grunt.mapFiles(self, grunt)
    };
    var line = assemble(self.target, assembleOptions);
    line.build(done);
  });

};