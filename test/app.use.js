require('mocha');
require('should');
var assert = require('assert');
var App = require('../');
var app;

describe('app.use', function () {
  beforeEach(function () {
    app = new App();
  });

  it('should expose the instance to `use`:', function (done) {
    app.use(function (inst) {
      assert(inst instanceof App);
      done();
    });
  });

  it('should be chainable:', function (done) {
    app.use(function (inst) {
        assert(inst instanceof App);
      })
      .use(function (inst) {
        assert(inst instanceof App);
      })
      .use(function (inst) {
        assert(inst instanceof App);
        done();
      })
  });
});
