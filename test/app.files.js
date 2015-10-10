require('mocha');
require('should');
var assert = require('assert');
var assemble = require('..');
var app;

describe('.files()', function () {
  beforeEach(function() {
    app = assemble();
  });

  describe('add files', function () {
    it('should add files to `app.views.files`:', function () {
      app.files({
        'a.hbs': {path: 'a.hbs', contents: new Buffer('a')},
        'b.hbs': {path: 'b.hbs', contents: new Buffer('b')},
        'c.hbs': {path: 'c.hbs', contents: new Buffer('c')},
      });
      assert(Object.keys(app.views.files).length === 3);
    });
  });
});
