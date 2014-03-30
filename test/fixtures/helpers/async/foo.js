
module.exports = function (config) {

  config.engine.registerAsyncHelper('asyncFoo', function (foo, options, done) {
    done(foo);
  });

};
