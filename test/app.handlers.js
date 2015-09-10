require('should');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var utils = require('../lib/utils');
var App = require('..');
var app;

function decorateViews(views) {
  var fn = views.decorateView;
  views.decorateView = function () {
    var view = fn.apply(fn, arguments);
    view.read = function () {
      if (!this.contents) {
        this.contents = fs.readFileSync(this.path);
      }
    };
    return view;
  };
  views.loader = function (pattern) {
    var files = utils.resolveGlob(pattern);
    return files.reduce(function (acc, fp) {
      acc[fp] = {path: fp};
      return acc;
    }, {});
  };
  return views;
}

describe.skip('handlers', function () {
  describe('custom handlers', function () {
    beforeEach(function () {
      app = new App();
      app.create('pages')
        .use(decorateViews)
        .option('renameKey', function (key) {
          return path.basename(key);
        });
    });

    it('should add custom middleware handlers:', function () {
      app.handler('foo');
      app.router.should.have.property('foo');
      assert.equal(typeof app.router.foo, 'function');
    });

    it('should add custom middleware handlers:', function () {
      app.pages.on('view', function (key, val) {
        val.read();
      });

      app.handler('foo');
      app.handler('bar');

      // app.on('foo', function () {
      //   console.log(arguments)
      // })

      app.foo(/./, function (view, next) {
        view.one = 'aaa';
        next();
      });

      app.bar(/./, function (view, next) {
        view.two = 'zzz';
        next();
      });

      var pages = app.pages('test/fixtures/templates/*.tmpl')
        .use(function (pages) {
          var fn = pages.decorateView;
          pages.decorateView = function (view) {
            view = fn(view);
            app.handleView('foo', view);
            return view;
          };
          return pages;
        });
        // .pages('test/fixtures/pages/*.hbs')
        // .use(function (pages) {
        //   var fn = pages.decorateView;
        //   pages.decorateView = function (view) {
        //     view = fn(view);
        //     app.handleView('bar', view);
        //     return view;
        //   };
        //   return pages;
        // })

      console.log(pages.getView('a.tmpl').one);
      // console.log(app.pages.getView('a.tmpl').one)
      // console.log(app.pages.getView('a.hbs').two)

      // app.pages.getView('a.txt').should.have.property('one');
      // app.pages.getView('a.txt').should.have.property('two');

      // app.pages.getView('a.md').should.not.have.property('one');
      // app.pages.getView('a.md').should.have.property('two');
    });

    // it('should add custom middleware handlers:', function () {
    //   app.handler('foo');
    //   app.handler('bar');

    //   function handle(method) {
    //     return function (view) {
    //       return app.handle(method, view);
    //     }
    //   }

    //   app.foo(/./, function (view, next) {
    //     view.one = 'aaa';
    //     next();
    //   });

    //   app.bar(/./, function (view, next) {
    //     view.two = 'zzz';
    //     next();
    //   });

    //   app.pages('test/fixtures/*.txt')
    //     .use(handle('foo'))

    //     .pages('test/fixtures/*.md')
    //     .use(handle('bar'))

    //     .use(utils.rename);

    //   app.pages.getView('a.txt').should.have.property('one');
    //   app.pages.getView('a.txt').should.have.property('two');

    //   app.pages.getView('a.md').should.not.have.property('one');
    //   app.pages.getView('a.md').should.have.property('two');
    // });
  });
});
