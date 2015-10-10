require('mocha');
require('should');
var assert = require('assert');
var assemble = require('..');
var app;

describe('.file()', function () {
  beforeEach(function() {
    app = assemble();
  });

  describe('add file', function () {
    it('should add files to `app.views.files`:', function () {
      app.file('a.hbs', {path: 'a.hbs', contents: new Buffer('a')});
      app.file('b.hbs', {path: 'b.hbs', contents: new Buffer('b')});
      app.file('c.hbs', {path: 'c.hbs', contents: new Buffer('c')});
      assert(Object.keys(app.views.files).length === 3);
    });
  });
});
