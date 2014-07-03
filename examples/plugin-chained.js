var middleware1 = require('assemble-permalinks');


/**
 * Foooooo
 */

module.exports = function(assemble) {

  return fs.src(patterns, options)
    .pipe(middleware1())
    .pipe(middleware2())
    .pipe(middleware3())
};



// ======================================================


var assemble = require('assemble');
var foooooo = require('assemble-foooooo');

assemble.task('foooooo', function () {
  assemble.src('test/*.js')
    .pipe(foooooo())
    .pipe(assemble.dest('dist'));
});

assemble.task('default', ['foooooo']);