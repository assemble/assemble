require('should');
var App = require('..');
var app;

describe('collection.option()', function () {
  beforeEach(function () {
    app = new App();
    app.create('page');
  });

  it('should emit events:', function () {
    app.pages('a.tmpl', {path: 'a.tmpl', content: '<%= a %>'});
    var events = [];

    app.pages.on('option', function (key, value) {
      events.push(key);
    });

    app.pages.option('a', 'b');
    app.pages.option('c', 'd');
    app.pages.option('e', 'f');
    app.pages.option({g: 'h'});

    events.should.eql(['a', 'c', 'e', 'g']);
  });
});
