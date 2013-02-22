module.exports = function(grunt) {

  // Run sub-grunt files in all projects.
  grunt.registerMultiTask('subgrunt', 'Run a sub-gruntfile.', function() {
    var path = require('path');
    var files = grunt.file.expandFiles(this.file.src);
    grunt.util.async.forEachSeries(files, function(gruntfile, next) {
      grunt.util.spawn({
        grunt: true,
        args: ['--gruntfile', path.resolve(gruntfile)]
      }, function(error, result) {
        if (error) {
          grunt.log.error(result.stdout).writeln();
          next(new Error('Error running sub-gruntfile "' + gruntfile + '".'));
        } else {
          grunt.verbose.ok(result.stdout);
          next();
        }
      });
    }, this.async());
  });
};