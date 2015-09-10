require('mocha');
require('should');
var assert = require('assert');
var matter = require('parser-front-matter');
var consolidate = require('consolidate');
var handlebars = require('engine-handlebars');
var swig = consolidate.swig;
require('swig');

var App = require('..');
var app;

describe('helpers', function () {
  describe('constructor', function () {
    it('should create an instance of Helpers:', function () {
      app = new App();
      assert(app instanceof App);
    });
  });

  describe('prototype methods', function () {
    beforeEach(function() {
      app = new App();
    });
    it('should expose `helper`', function () {
      assert(typeof app.helper ==='function');
    });
    it('should expose `asyncHelper`', function () {
      assert(typeof app.asyncHelper ==='function');
    });
  });

  describe('helpers', function() {
    beforeEach(function() {
      app = new App();
    });

    it('should throw an error when value is invalid:', function () {
      (function () {
        app.helper('foo', {});
      }).should.throw('expected helper fn to be a function.');
    });

    it('should add a sync helper to the `sync` object:', function () {
      app.helper('one', function () {});
      assert(typeof app._.helpers.sync.one === 'function');
    });

    it('should get a sync helper:', function () {
      app.helper('one', function () {});
      assert(typeof app.helper('one') === 'function');
    });

    it('should load a glob of sync helper functions:', function () {
      app.helpers('test/fixtures/helpers/[a-c].js');
      assert(typeof app._.helpers.sync.a === 'function');
      assert(typeof app._.helpers.sync.b === 'function');
      assert(typeof app._.helpers.sync.c === 'function');
    });

    it('should fail gracefully on bad globs:', function () {
      app.helpers('test/fixtures/helpers/*.foo');
      app._.helpers.sync.should.eql({});
    });

    it('should throw an error if an invalid arg is passed:', function () {
      (function () {
        app.helpers(function() {});
      }).should.throw('expected helpers to be an object.');
    });

    it('should add a glob of sync helper objects:', function () {
      app.helpers('test/fixtures/helpers/!([a-c]).js');
      assert(typeof app._.helpers.sync.one === 'function');
      assert(typeof app._.helpers.sync.two === 'function');
      assert(typeof app._.helpers.sync.three === 'function');
    });

    it('should add a glob with mixed helper objects and functions:', function () {
      app.helpers('test/fixtures/helpers/*.js');
      assert(typeof app._.helpers.sync.a === 'function');
      assert(typeof app._.helpers.sync.b === 'function');
      assert(typeof app._.helpers.sync.c === 'function');
      assert(typeof app._.helpers.sync.one === 'function');
      assert(typeof app._.helpers.sync.two === 'function');
      assert(typeof app._.helpers.sync.three === 'function');
    });

    it('should add an object of sync helpers to the `sync` object:', function () {
      app.helpers({
        x: function () {},
        y: function () {},
        z: function () {}
      });

      assert(typeof app._.helpers.sync.x === 'function');
      assert(typeof app._.helpers.sync.y === 'function');
      assert(typeof app._.helpers.sync.z === 'function');
    });
  });

  describe('async helpers', function() {
    beforeEach(function() {
      app = new App();
    });

    it('should throw an error when value is invalid:', function () {
      (function () {
        app.asyncHelper('foo', {});
      }).should.throw('expected helper fn to be a function.');
    });

    it('should add an async helper to the `async` object:', function () {
      app.asyncHelper('two', function () {});
      assert(typeof app._.helpers.async.two === 'function');
    });

    it('should get an async helper:', function () {
      app.asyncHelper('one', function () {});
      assert(typeof app.asyncHelper('one') === 'function');
    });

    it('should load a glob of async helper functions:', function () {
      app.asyncHelpers('test/fixtures/helpers/[a-c].js');
      assert(typeof app._.helpers.async.a === 'function');
      assert(typeof app._.helpers.async.b === 'function');
      assert(typeof app._.helpers.async.c === 'function');
    });

    it('should add a glob of async helper objects:', function () {
      app.asyncHelpers('test/fixtures/helpers/!([a-c]).js');
      assert(typeof app._.helpers.async.one === 'function');
      assert(typeof app._.helpers.async.two === 'function');
      assert(typeof app._.helpers.async.three === 'function');
    });

    it('should fail gracefully on bad globs:', function () {
      app.asyncHelpers('test/fixtures/helpers/*.foo');
      app._.helpers.async.should.eql({});
    });

    it('should throw an error if an invalid arg is passed:', function () {
      (function () {
        app.asyncHelpers(function() {});
      }).should.throw('expected helpers to be an object.');
    });

    it('should add a glob with mixed helper objects and functions:', function () {
      app.asyncHelpers('test/fixtures/helpers/*.js');
      assert(typeof app._.helpers.async.a === 'function');
      assert(typeof app._.helpers.async.b === 'function');
      assert(typeof app._.helpers.async.c === 'function');
      assert(typeof app._.helpers.async.one === 'function');
      assert(typeof app._.helpers.async.two === 'function');
      assert(typeof app._.helpers.async.three === 'function');
    });

    it('should add an object of async helpers to the `async` object:', function () {
      app.asyncHelpers({
        x: function () {},
        y: function () {},
        z: function () {}
      });

      assert(typeof app._.helpers.async.x === 'function');
      assert(typeof app._.helpers.async.y === 'function');
      assert(typeof app._.helpers.async.z === 'function');
    });
  });
});

describe('sync helpers', function () {
  beforeEach(function () {
    app = new App();
    app.engine('tmpl', require('engine-base'));
    app.create('page');
  });

  it('should register a helper:', function () {
    app.helper('a', function () {});
    app.helper('b', function () {});
    app._.helpers.sync.should.have.property('a');
    app._.helpers.sync.should.have.property('b');
  });

  it('should use a helper:', function (done) {
    app.pages('a.tmpl', {path: 'a.tmpl', content: '<%= upper(a) %>', locals: {a: 'bbb'}});
    app.helper('upper', function (str) {
      return str.toUpperCase();
    });

    var page = app.pages.getView('a.tmpl');
    app.render(page, function (err, view) {
      if (err) return done(err);

      assert.equal(typeof view.contents.toString(), 'string');
      assert.equal(view.contents.toString(), 'BBB');
      done();
    });
  });
});

describe('async helpers', function () {
  beforeEach(function () {
    app = new App();
    app.engine('tmpl', require('engine-base'));
    app.create('page');
  });

  it('should register an async helper:', function () {
    app.asyncHelper('a', function () {});
    app.asyncHelper('b', function () {});
    app._.helpers.async.should.have.property('a');
    app._.helpers.async.should.have.property('b');
  });

  it('should use an async helper:', function (done) {
    app.pages('a.tmpl', {path: 'a.tmpl', content: '<%= lower(a) %>', locals: {a: 'BBB'}});
    app.asyncHelper('lower', function (str, next) {
      if (typeof next !== 'function') return str;
      next(null, str.toLowerCase());
    });

    var page = app.pages.getView('a.tmpl');
    app.render(page, function (err, view) {
      if (err) return done(err);
      assert.equal(typeof view.contents.toString(), 'string');
      assert.equal(view.contents.toString(), 'bbb');
      done();
    });
  });
});

describe('built-in helpers:', function () {
  describe('automatically generated helpers for default view types:', function () {
    beforeEach(function () {
      app = new App({rethrow: false});
      app.engine('md', require('engine-base'));
      app.engine('tmpl', require('engine-base'));
      app.create('partials', { viewType: 'partial' });
      app.create('pages');

      // parse front matter
      app.onLoad(/./, function (view, next) {
        matter.parse(view, function(err, res) {
          view.contents = new Buffer(res.content);
          view.data = res.data;
          next();
        });
      });
    });

    it('should expose front matter to the `partial` helper.', function (done) {
      app.partial('a.md', {content: '---\nname: "AAA"\n---\n<%= name %>', locals: {name: 'BBB'}});
      app.page('b.md', {path: 'b.md', content: 'foo <%= partial("a.md") %> bar'});

      app.render('b.md', function (err, res) {
        if (err) return done(err);
        res.contents.toString().should.equal('foo AAA bar');
        done();
      });
    });

    it('should use helper locals.', function (done) {
      app.partial('abc.md', {content: '---\nname: "AAA"\n---\n<%= name %>', locals: {name: 'BBB'}});
      app.page('xyz.md', {path: 'xyz.md', content: 'foo <%= partial("abc.md", { name: "CCC" }) %> bar'});

      app.render('xyz.md', {name: 'DDD'}, function (err, res) {
        if (err) return done(err);
        res.contents.toString().should.equal('foo CCC bar');
        done();
      });
    });

    it('should use front matter data.', function (done) {
      app.partial('abc.md', {content: '---\nname: "AAA"\n---\n<%= name %>'});
      app.page('xyz.md', {path: 'xyz.md', content: 'foo <%= partial("abc.md") %> bar'});

      app.render('xyz.md', {name: 'DDD'}, function (err, res) {
        if (err) return done(err);
        res.contents.toString().should.equal('foo AAA bar');
        done();
      });
    });

    it('should use partial locals:', function (done) {
      app.partial('abc.md', {content: '<%= name %>', locals: {name: 'EEE'}});

      app.page('xyz.md', {path: 'xyz.md', content: 'foo <%= partial("abc.md") %> bar'})
        .render({name: 'DDD'}, function (err, res) {
          if (err) return done(err);
          res.contents.toString().should.equal('foo EEE bar');
          done();
        });
    });

    it.skip('should use locals from the `view.render` method:', function (done) {
      app.partial('abc.md', {content: '<%= name %>', locals: {name: 'EEE'}});

      app.page('xyz.md', {path: 'xyz.md', content: 'foo <%= partial("abc.md") %> bar'})
        .render({name: 'DDD'}, function (err, res) {
          if (err) return done(err);

          res.contents.toString().should.equal('foo EEE bar');
          done();
        });
    });

    it('should use locals from the `app.render` method:', function (done) {
      app.partial('abc.md', {content: '<%= name %>'});
      app.page('xyz.md', {path: 'xyz.md', content: 'foo <%= partial("abc.md") %> bar'});

      app.render('xyz.md', {name: 'DDD'}, function (err, res) {
        if (err) return done(err);
        res.contents.toString().should.equal('foo DDD bar');
        done();
      });
    });

    it('should return an empty string when the partial is missing.', function (done) {
      app.partial('abc.md', {content: '---\nname: "AAA"\n---\n<%= name %>', locals: {name: 'BBB'}});
      app.page('xyz.md', {path: 'xyz.md', content: 'foo <%= partial("def.md", { name: "CCC" }) %> bar'});
      app.render('xyz.md', {name: 'DDD'}, function (err, res) {
        if (err) return done(err);
        res.contents.toString().should.equal('foo  bar');
        done();
      });
    });

    it.skip('should throw an error when something is wrong in a partial', function (done) {
      var called = false;
      var cb = function (err) {
        if (called) return;
        called = true;
        done(err);
      };

      app.partial('abc.md', {content: '---\nname: "AAA"\n---\n<%= name %> - <%= foo(name) %>', locals: {name: 'BBB'}});
      app.page('xyz.md', {path: 'xyz.md', content: 'foo <%= partial("abc.md", { name: "CCC" }) %> bar'});
      app.render('xyz.md', {name: 'DDD'}, function (err, res) {
        if (!err) return cb('Expected an error.');
        cb();
      });
    });
  });

  describe('helper context:', function () {
    beforeEach(function () {
      app = new App({rethrow: false});
      app.engine(['tmpl', 'md'], require('engine-base'));
      app.create('partial', { viewType: 'partial' });
      app.create('page');

      // parse front matter
      app.onLoad(/./, function (view, next) {
        matter.parse(view, function(err, res) {
          view.contents = new Buffer(res.content);
          view.data = res.data;
          next();
        });
      });
    });

    it.skip('should prefer front-matter over view locals and helper locals.', function (done) {
      // app.disable('prefer locals');
      app.partial('a.md', {content: '---\nname: "AAA"\n---\n<%= name %>', locals: {name: 'BBB'}});
      app.page('b.md', {path: 'b.md', content: 'foo <%= partial("a.md") %> bar'});

      app.render('b.md', function (err, res) {
        if (err) return done(err);
        res.contents.toString().should.equal('foo AAA bar');
        done();
      });
    });

    it('should prefer helper locals over view locals.', function (done) {
      app.partial('abc.md', {content: '<%= name %>', name: 'BBB'});
      app.page('xyz.md', {path: 'xyz.md', content: 'foo <%= partial("abc.md", { name: "CCC" }) %> bar'});

      app.render('xyz.md', {name: 'DDD'}, function (err, res) {
        if (err) return done(err);
        res.contents.toString().should.equal('foo CCC bar');
        done();
      });
    });

    it('should give preference to view locals over render locals.', function (done) {
      app.partial('abc.md', {content: '<%= name %>', locals: {name: 'BBB'}});
      app.page('xyz.md', {path: 'xyz.md', content: 'foo <%= partial("abc.md") %> bar'});

      var page = app.pages.getView('xyz.md');

      app.render(page, {name: 'DDD'}, function (err, res) {
        if (err) return done(err);
        res.contents.toString().should.equal('foo BBB bar');
        done();
      });
    });

    it('should use render locals when other locals are not defined.', function (done) {
      app.partial('abc.md', {content: '<%= name %>'});
      app.page('xyz.md', {path: 'xyz.md', content: 'foo <%= partial("abc.md") %> bar'});

      app.render('xyz.md', {name: 'DDD'}, function (err, res) {
        if (err) return done(err);
        res.contents.toString().should.equal('foo DDD bar');
        done();
      });
    });
  });

  describe('user-defined engines:', function () {
    beforeEach(function () {
      app = new App({rethrow: false});
      app.create('partial', { viewType: 'partial' });
      app.create('page');

      // parse front matter
      app.onLoad(/./, function (view, next) {
        matter.parse(view, function(err, res) {
          view.contents = new Buffer(res.content);
          view.data = res.data;
          next();
        });
      });
    });

    it.skip('should use the `partial` helper with handlebars.', function (done) {
      app.engine(['tmpl', 'md'], require('engine-base'));
      app.engine('hbs', handlebars);

      app.partial('title', {content: '<title>{{name}}</title>', locals: {name: 'BBB'}});
      app.page('a.hbs', {path: 'a.hbs', content: 'foo {{{partial "title.hbs" this}}} bar'});

      app.render('a.hbs', {name: 'Halle Nicole'}, function (err, res) {
        if (err) return done(err);
        res.contents.toString().should.equal('foo <title>Halle Nicole</title> bar');
        done();
      });
    });

    it('should use the `partial` helper with any engine.', function (done) {
      app.engine('hbs', handlebars);
      app.engine('md', handlebars);
      app.engine('swig', swig);
      app.engine('tmpl', require('engine-base'));

      app.partial('a.hbs', {content: '---\nname: "AAA"\n---\n<title>{{name}}</title>', locals: {name: 'BBB'}});
      app.page('a.hbs', {path: 'a.hbs', content: '<title>{{author}}</title>', locals: {author: 'Halle Nicole'}});
      app.page('b.tmpl', {path: 'b.tmpl', content: '<title><%= author %></title>', locals: {author: 'Halle Nicole'}});
      app.page('d.swig', {path: 'd.swig', content: '<title>{{author}}</title>', locals: {author: 'Halle Nicole'}});
      app.page('e.swig', {path: 'e.swig', content: '<title>{{author}}</title>', locals: {author: 'Halle Nicole'}});
      app.page('f.hbs', {content: '<title>{{author}}</title>', locals: {author: 'Halle Nicole'}});
      app.page('g.md', {content: '---\nauthor: Brian Woodward\n---\n<title>{{author}}</title>', locals: {author: 'Halle Nicole'}});
      app.page('with-partial.hbs', {path: 'with-partial.hbs', content: '{{{partial "a.hbs" custom.locals}}}'});

      var locals = {custom: {locals: {name: 'Halle Nicole' }}};
      app.render('a.hbs', locals, function (err, res) {
        if (err) return console.log(err);
        res.contents.toString().should.equal('<title>Halle Nicole</title>');
      });

      app.render('with-partial.hbs', locals, function (err, res) {
        if (err) return console.log(err);
        res.contents.toString().should.equal('<title>Halle Nicole</title>');
      });

      var page = app.pages.getView('g.md');
      locals.author = page.data.author || locals.author;
      page.render(locals, function (err, res) {
        if (err) return done(err);
        res.contents.toString().should.equal('<title>Brian Woodward</title>');
        done(null, res.contents.toString());
      });
    });
  });
});

