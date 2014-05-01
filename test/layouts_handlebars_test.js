/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

var expect = require('chai').expect;
var assemble = require('../');
var layouts = require('../lib/engines/handlebars/layouts');

describe('handlebars layouts', function() {

  var testid = 1;
  var name = function () {
    return 'handlebars-layout-test-' + (testid++);
  };

  describe('loadLayout():', function() {
    describe('when no layout is defined', function() {
      it('should load the default layout', function (done) {
        var app = assemble({name: name()});
        layouts.loadLayout(app, '', function (err, layout) {
          if (err) {
            console.log('Error', err);
            return done(err);
          }
          expect(layout).to.be.instanceof(assemble.models.Component);
          expect(layout).to.have.property('content');
          expect(layout.content).to.be.eql('{{body}}');
          done();
        });
      });
    });


    describe('when a full source path is defined for a layout:', function() {
      it('should load the given layout', function (done) {
        var expected = [
          'Default Layout: [head]',
          '{{body}}',
          'Default Layout: [footer]',
          ''
        ].join('\n');

        var app = assemble({name: name()});
        layouts.loadLayout(app, 'test/fixtures/templates/layouts/default.hbs', function (err, layout) {
          if (err) {
            console.log('Error', err);
            return done(err);
          }
          expect(layout).to.be.instanceof(assemble.models.Component);
          expect(layout).to.have.property('content');
          expect(layout.content).to.be.eql(expected);
          done();
        });
      });
    });


    describe('when a layout directory and extension are defined:', function() {
      it('should load a layout using only it\'s basename', function (done) {
        var expected = [
          'Default Layout: [head]',
          '{{body}}',
          'Default Layout: [footer]',
          ''
        ].join('\n');

        var app = assemble({
          layoutdir: 'test/fixtures/templates/layouts/',
          layoutext: '.hbs'
        });

        layouts.loadLayout(app, 'default', function (err, layout) {
          if (err) {
            console.log('Error', err);
            return done(err);
          }
          expect(layout).to.be.instanceof(assemble.models.Component);
          expect(layout).to.have.property('content');
          expect(layout.content).to.be.eql(expected);

          done();
        });
      });
    });


    describe('when a source path is given for a layout that extends other layouts:', function() {
      it('should load the nested layout and it\'s parent layout:', function (done) {
        var expected = [
          'Default Layout: [head]',
          '',
          'Nested One: [head]',
          '{{body}}',
          'Nested One: [footer]',
          '',
          'Default Layout: [footer]',
          ''
        ].join('\n');

        var assembleOpts = {
          layoutdir: 'test/fixtures/templates/layouts/',
          layoutext: '.hbs'
        };

        var app = assemble(assembleOpts);
        layouts.loadLayout(app, 'nested-1', function (err, layout) {
          if (err) {
            console.log('Error', err);
            return done(err);
          }
          expect(layout).to.be.instanceof(assemble.models.Component);
          expect(layout).to.have.property('content');
          expect(layout.content).to.be.eql(expected);

          done();
        });
      });

      it('should load the nested layout and all of it\'s parent layouts', function (done) {
        var expected = [
          'Default Layout: [head]',
          '',
          'Nested One: [head]',
          '',
          'Nested Two: [head]',
          '{{body}}',
          'Nested Two: [footer]',
          '',
          'Nested One: [footer]',
          '',
          'Default Layout: [footer]',
          ''
        ].join('\n');

        var app = assemble({
          layoutdir: 'test/fixtures/templates/layouts/',
          layoutext: '.hbs'
        });

        layouts.loadLayout(app, 'nested-2', function (err, layout) {
          if (err) {
            console.log('Error', err);
            return done(err);
          }
          expect(layout).to.be.instanceof(assemble.models.Component);
          expect(layout).to.have.property('content');
          expect(layout.content).to.be.eql(expected);

          done();
        });
      });
    });
  });

  describe('loadDefaultLayout()', function () {

    // @doowb, is the "default" layout the user-defined default, or the "assemble default"?
    //
    // Also, what does this next test mean? I see what it's doing, but I'm not clear on the logic.
    // - [ ] when no layout is defined, should load the default layout
    // - [ ] when a layout is defined but cannot be found, should load the default layout
    // - [ ] when the layout src path is defined as an empty string, should load the default layout

    it('should load a default layout when none is found', function (done) {
      var app = assemble({layout: ''});
      layouts.loadDefaultLayout(app, function (err) {
        if (err) {
          console.log('Error', err);
          return done(err);
        }
        expect(app.defaultLayout).to.be.instanceof(assemble.models.Component);
        expect(app.defaultLayout).to.have.property('content');
        expect(app.defaultLayout.content).to.be.eql('{{body}}');
        done();
      });
    });


    it('should load a default layout given a src path', function (done) {
      var expected = [
        'Default Layout: [head]',
        '{{body}}',
        'Default Layout: [footer]',
        ''
      ].join('\n');

      var assembleOpts = {
        layout: 'test/fixtures/templates/layouts/default.hbs'
      };

      var app = assemble(assembleOpts);
      layouts.loadDefaultLayout(app, function (err) {
        if (err) {
          console.log('Error', err);
          return done(err);
        }
        expect(app.defaultLayout).to.be.instanceof(assemble.models.Component);
        expect(app.defaultLayout).to.have.property('content');
        expect(app.defaultLayout.content).to.be.eql(expected);

        done();
      });
    });

    it('should load a default layout given a shortened src path', function (done) {
      var expected = [
        'Default Layout: [head]',
        '{{body}}',
        'Default Layout: [footer]',
        ''
      ].join('\n');

      var assembleOpts = {
        layout: 'default',
        layoutdir: 'test/fixtures/templates/layouts/',
        layoutext: '.hbs'
      };

      var app = assemble(assembleOpts);
      layouts.loadDefaultLayout(app, function (err) {
        if (err) {
          console.log('Error', err);
          return done(err);
        }
        expect(app.defaultLayout).to.be.instanceof(assemble.models.Component);
        expect(app.defaultLayout).to.have.property('content');
        expect(app.defaultLayout.content).to.be.eql(expected);

        done();
      });
    });

    it('should load nested default layouts given a src path', function (done) {
      var expected = [
        'Default Layout: [head]',
        '',
        'Nested One: [head]',
        '{{body}}',
        'Nested One: [footer]',
        '',
        'Default Layout: [footer]',
        ''
      ].join('\n');

      var assembleOpts = {
        layout: 'nested-1',
        layoutdir: 'test/fixtures/templates/layouts/',
        layoutext: '.hbs'
      };

      var app = assemble(assembleOpts);
      layouts.loadDefaultLayout(app, function (err) {
        if (err) {
          console.log('Error', err);
          return done(err);
        }
        expect(app.defaultLayout).to.be.instanceof(assemble.models.Component);
        expect(app.defaultLayout).to.have.property('content');
        expect(app.defaultLayout.content).to.be.eql(expected);

        done();
      });
    });

    it('should load multiple nested default layouts given a src path', function (done) {
      var expected = [
        'Default Layout: [head]',
        '',
        'Nested One: [head]',
        '',
        'Nested Two: [head]',
        '{{body}}',
        'Nested Two: [footer]',
        '',
        'Nested One: [footer]',
        '',
        'Default Layout: [footer]',
        ''
      ].join('\n');

      var assembleOpts = {
        layout: 'nested-2',
        layoutdir: 'test/fixtures/templates/layouts/',
        layoutext: '.hbs'
      };

      var app = assemble(assembleOpts);
      layouts.loadDefaultLayout(app, function (err) {
        if (err) {
          console.log('Error', err);
          return done(err);
        }
        expect(app.defaultLayout).to.be.instanceof(assemble.models.Component);
        expect(app.defaultLayout).to.have.property('content');
        expect(app.defaultLayout.content).to.be.eql(expected);

        done();
      });
    });

  });

  describe('load component layout', function () {


    it('should load a default layout when none is found', function (done) {

      var assembleOpts = {
        layout: ''
      };

      var componentOpts = {
        src: 'layout-test-component',
        name: 'layout-test-component',
        content: '{{foo}}',
        data: {
          foo: 'bar'
        }
      };
      var component = new assemble.models.Component(componentOpts);

      var app = assemble(assembleOpts);
      layouts.loadDefaultLayout(app, function (err) {
        if (err) {
          console.log('Error', err);
          return done(err);
        }
        layouts.loadComponentLayout(app, component, function (err) {
          if (err) {
            console.log('Error', err);
            return done(err);
          }
          expect(component.content).to.be.eql('{{foo}}');
          done();
        });
      });

    });

    it('should load a default layout when yfm layout is set to none', function (done) {

      var assembleOpts = {
        layout: 'none'
      };

      var componentOpts = {
        src: 'layout-test-component',
        name: 'layout-test-component',
        content: '{{foo}}',
        data: {
          foo: 'bar'
        }
      };
      var component = new assemble.models.Component(componentOpts);

      var app = assemble(assembleOpts);
      layouts.loadDefaultLayout(app, function (err) {
        if (err) {
          console.log('Error', err);
          return done(err);
        }
        layouts.loadComponentLayout(app, component, function (err) {
          if (err) {
            console.log('Error', err);
            return done(err);
          }
          expect(component.content).to.be.eql('{{foo}}');
          done();
        });
      });

    });

    it('should load a default layout given a src path', function (done) {
      var expected = [
        'Default Layout: [head]',
        '{{foo}}',
        'Default Layout: [footer]',
        ''
      ].join('\n');

      var assembleOpts = {
        name: name()
      };

      var componentOpts = {
        src: 'layout-test-component',
        name: 'layout-test-component',
        content: '{{foo}}',
        data: {
          layout: 'test/fixtures/templates/layouts/default.hbs',
          foo: 'bar'
        }
      };
      var component = new assemble.models.Component(componentOpts);

      var app = assemble(assembleOpts);
      layouts.loadDefaultLayout(app, function (err) {
        if (err) {
          console.log('Error', err);
          return done(err);
        }
        layouts.loadComponentLayout(app, component, function (err) {
          if (err) {
            console.log('Error', err);
            return done(err);
          }
          expect(component.content).to.be.eql(expected);
          done();
        });
      });
    });

    it('should load a default layout given a shortened src path', function (done) {
      var expected = [
        'Default Layout: [head]',
        '{{foo}}',
        'Default Layout: [footer]',
        ''
      ].join('\n');

      var assembleOpts = {
        layoutdir: 'test/fixtures/templates/layouts/',
        layoutext: '.hbs'
      };

      var componentOpts = {
        src: 'layout-test-component',
        name: 'layout-test-component',
        content: '{{foo}}',
        data: {
          layout: 'default',
          foo: 'bar'
        }
      };
      var component = new assemble.models.Component(componentOpts);

      var app = assemble(assembleOpts);
      layouts.loadDefaultLayout(app, function (err) {
        if (err) {
          console.log('Error', err);
          return done(err);
        }
        layouts.loadComponentLayout(app, component, function (err) {
          if (err) {
            console.log('Error', err);
            return done(err);
          }
          expect(component.content).to.be.eql(expected);
          done();
        });
      });
    });

    it('should load nested default layouts given a src path', function (done) {
      var expected = [
        'Default Layout: [head]',
        '',
        'Nested One: [head]',
        '{{foo}}',
        'Nested One: [footer]',
        '',
        'Default Layout: [footer]',
        ''
      ].join('\n');

      var assembleOpts = {
        layoutdir: 'test/fixtures/templates/layouts/',
        layoutext: '.hbs'
      };

      var componentOpts = {
        src: 'layout-test-component',
        name: 'layout-test-component',
        content: '{{foo}}',
        data: {
          layout: 'nested-1',
          foo: 'bar'
        }
      };
      var component = new assemble.models.Component(componentOpts);

      var app = assemble(assembleOpts);
      layouts.loadDefaultLayout(app, function (err) {
        if (err) {
          console.log('Error', err);
          return done(err);
        }
        layouts.loadComponentLayout(app, component, function (err) {
          if (err) {
            console.log('Error', err);
            return done(err);
          }
          expect(component.content).to.be.eql(expected);
          done();
        });
      });
    });

    it('should load multiple nested default layouts given a src path', function (done) {
      var expected = [
        'Default Layout: [head]',
        '',
        'Nested One: [head]',
        '',
        'Nested Two: [head]',
        '{{foo}}',
        'Nested Two: [footer]',
        '',
        'Nested One: [footer]',
        '',
        'Default Layout: [footer]',
        ''
      ].join('\n');

      var assembleOpts = {
        layoutdir: 'test/fixtures/templates/layouts/',
        layoutext: '.hbs'
      };

      var componentOpts = {
        src: 'layout-test-component',
        name: 'layout-test-component',
        content: '{{foo}}',
        data: {
          layout: 'nested-2',
          foo: 'bar'
        }
      };
      var component = new assemble.models.Component(componentOpts);

      var app = assemble(assembleOpts);
      layouts.loadDefaultLayout(app, function (err) {
        if (err) {
          console.log('Error', err);
          return done(err);
        }
        layouts.loadComponentLayout(app, component, function (err) {
          if (err) {
            console.log('Error', err);
            return done(err);
          }
          expect(component.content).to.be.eql(expected);
          done();
        });
      });
    });

  });

  describe('layouts with yfm templates', function () {

    it('should load a default layout from templates', function (done) {
      var expected = [
        'Default Layout: [head]',
        '{{body}}',
        'Default Layout: [footer]',
        ''
      ].join('\n');

      var assembleOpts = {
        site: {
          adminLayout: 'test/fixtures/templates/layouts/default.hbs'
        },
        layout: '<%= site.adminLayout %>'
      };

      var app = assemble(assembleOpts);
      layouts.loadDefaultLayout(app, function (err) {
        if (err) {
          console.log('Error', err);
          return done(err);
        }
        expect(app.defaultLayout).to.be.instanceof(assemble.models.Component);
        expect(app.defaultLayout).to.have.property('content');
        expect(app.defaultLayout.content).to.be.eql(expected);

        done();
      });
    });

    it('should load a nested default layout from layout yfm templates', function (done) {

      var expected = [
        'Default Layout: [head]',
        '',
        'YFM: [head]',
        '{{body}}',
        'YFM: [footer]',
        '',
        'Default Layout: [footer]',
        ''
      ].join('\n');

      var assembleOpts = {
        layoutdir: 'test/fixtures/templates/layouts/',
        layoutext: '.hbs',
        layout: 'yfm',
        site: {
          adminLayout: 'default'
        }
      };

      var app = assemble(assembleOpts);
      layouts.loadDefaultLayout(app, function (err) {
        if (err) {
          console.log('Error', err);
          return done(err);
        }
        expect(app.defaultLayout).to.be.instanceof(assemble.models.Component);
        expect(app.defaultLayout).to.have.property('content');
        expect(app.defaultLayout.content).to.be.eql(expected);

        done();
      });
    });

    it('should load a layout from a component yfm templates', function (done) {
      var expected = [
        'Default Layout: [head]',
        '{{foo}}',
        'Default Layout: [footer]',
        ''
      ].join('\n');

      var assembleOpts = {
        layoutdir: 'test/fixtures/templates/layouts/',
        layoutext: '.hbs',
        site: {
          adminLayout: 'default'
        }
      };

      var componentOpts = {
        src: 'layout-test-component',
        name: 'layout-test-component',
        content: '{{foo}}',
        data: {
          layout: '<%= site.adminLayout %>',
          foo: 'bar'
        }
      };
      var component = new assemble.models.Component(componentOpts);

      var app = assemble(assembleOpts);
      layouts.loadDefaultLayout(app, function (err) {
        if (err) {
          console.log('Error', err);
          return done(err);
        }
        layouts.loadComponentLayout(app, component, function (err) {
          if (err) {
            console.log('Error', err);
            return done(err);
          }
          expect(component.content).to.be.eql(expected);
          done();
        });
      });
    });


  });
});
