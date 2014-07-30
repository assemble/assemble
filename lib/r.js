
var assemble = require('..');
var myRoutes = assemble.router();

myRoutes.route(':basename.hbs', function(file, params, next) {
  // do something with the file
  next();
});


var stream = myRoutes();












assemble.route(':basename.hbs', function(file, params, next) {
  // do something with the file
  next();
});

assemble.src('')
  .pipe(assemble.dest());