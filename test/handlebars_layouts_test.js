

/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
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

  describe('load layout', function() {

    it('should load a default layout when none is found', function (done) {

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

    it('should load a layout given a src path', function (done) {
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

    it('should load a layout given a shortened src path', function (done) {
      var expected = [
        'Default Layout: [head]',
        '{{body}}',
        'Default Layout: [footer]',
        ''
      ].join('\n');

      var assembleOpts = {
        name: name(),
        metadata: {
          layoutdir: 'test/fixtures/templates/layouts/',
          layoutext: '.hbs'
        }
      };

      var app = assemble(assembleOpts);
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

    it('should load nested layouts given a src path', function (done) {
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
        name: name(),
        metadata: {
          layoutdir: 'test/fixtures/templates/layouts/',
          layoutext: '.hbs'
        }
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

    it('should load multiple nested layouts given a src path', function (done) {
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
        name: name(),
        metadata: {
          layoutdir: 'test/fixtures/templates/layouts/',
          layoutext: '.hbs'
        }
      };

      var app = assemble(assembleOpts);
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

  describe('load default layout', function () {

    it('should load a default layout when none is found', function (done) {

      var assembleOpts = {
        name: name(),
        metadata: {
          layout: ''
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
        name: name(),
        metadata: {
          layout: 'test/fixtures/templates/layouts/default.hbs'
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

    it('should load a default layout given a shortened src path', function (done) {
      var expected = [
        'Default Layout: [head]',
        '{{body}}',
        'Default Layout: [footer]',
        ''
      ].join('\n');

      var assembleOpts = {
        name: name(),
        metadata: {
          layout: 'default',
          layoutdir: 'test/fixtures/templates/layouts/',
          layoutext: '.hbs'
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
        name: name(),
        metadata: {
          layout: 'nested-1',
          layoutdir: 'test/fixtures/templates/layouts/',
          layoutext: '.hbs'
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
        name: name(),
        metadata: {
          layout: 'nested-2',
          layoutdir: 'test/fixtures/templates/layouts/',
          layoutext: '.hbs'
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

  });

  describe('load component layout', function () {


    it('should load a default layout when none is found', function (done) {

      var assembleOpts = {
        name: name(),
        metadata: {
          layout: ''
        }
      };

      var componentOpts = {
        src: 'layout-test-component',
        name: 'layout-test-component',
        content: '{{foo}}',
        metadata: {
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
        metadata: {
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
        name: name(),
        metadata: {
          layoutdir: 'test/fixtures/templates/layouts/',
          layoutext: '.hbs'
        }
      };

      var componentOpts = {
        src: 'layout-test-component',
        name: 'layout-test-component',
        content: '{{foo}}',
        metadata: {
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
        name: name(),
        metadata: {
          layoutdir: 'test/fixtures/templates/layouts/',
          layoutext: '.hbs'
        }
      };

      var componentOpts = {
        src: 'layout-test-component',
        name: 'layout-test-component',
        content: '{{foo}}',
        metadata: {
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
        name: name(),
        metadata: {
          layoutdir: 'test/fixtures/templates/layouts/',
          layoutext: '.hbs'
        }
      };

      var componentOpts = {
        src: 'layout-test-component',
        name: 'layout-test-component',
        content: '{{foo}}',
        metadata: {
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
});
