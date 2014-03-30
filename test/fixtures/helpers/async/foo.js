
module.exports = function (config) {

  config.engine.registerAsyncHelper('asyncFoo', function (foo, options, done) {
    done(foo);
  });

  // add a long running helper
  config.engine.registerAsyncHelper('timeout', function (seconds, options, done) {
    setTimeout(function () { done('Finished in ' + seconds + ' seconds.'); }, seconds * 1000);
  });

};
