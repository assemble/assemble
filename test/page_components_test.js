/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

var expect = require('chai').expect;
var _ = require('lodash');

var assemble = require('../');

describe('page components', function() {

  it('should register partials as ember style components', function (done) {
    var options = {
      test: {
        'btn-attrs': {
          class: 'btn'
        },
        'alert-attrs': {
          class: "alert alert-warning fade in"
        }
      },
      helpers: ['test/fixtures/helpers/*.js'],
      partials: ['test/fixtures/templates/includes/*.hbs'],
      components: ['test/fixtures/templates/includes/*.hbs'],
      pages: []
    };

    var pages = [
      {
        name: 'page1',
        data: {
          title: 'Page 1 Title'
        },
        content: [
          '<h1>{{title}}</h1>',
          '<h2>Partials</h2>',
          '<h3>Button</h3>',
          '{{> btn test.btn-attrs}}',
          '<h3>Alert</h3>',
          '{{> alert test.alert-attrs}}',
          '<h2>Components</h2>',
          '<h3>Button</h3>',
          '{{btn class="btn"}}',
          '<h3>Alert</h3>',
          '{{alert class="alert alert-warning fade in"}}'
        ].join('\n')
      }
    ];

    var expected = [
      '<h1>Page 1 Title</h1>',
      '<h2>Partials</h2>',
      '<h3>Button</h3>',
      '',
      '',
      '<button class="btn"></button>',
      '',
      '<h3>Alert</h3>',
      '',
      '',
      '<div class="alert alert-warning fade in">',
      '  ',
      '',
      '<button aria-hidden="true" data-dismiss="alert" class="close" type="button">&times;</button>',
      '',
      '  <strong>Holy guacamole!</strong> Best check yo self, you\'re not looking too good.',
      '</div>',
      '',
      '<h2>Components</h2>',
      '<h3>Button</h3>',
      '',
      '',
      '<button class="btn"></button>',
      '',
      '<h3>Alert</h3>',
      '',
      '',
      '<div class="alert alert-warning fade in">',
      '  ',
      '',
      '<button aria-hidden="true" data-dismiss="alert" class="close" type="button">&times;</button>',
      '',
      '  <strong>Holy guacamole!</strong> Best check yo self, you\'re not looking too good.',
      '</div>',
      ''
    ].join('\n');

    for (var i = 0; i < pages.length; i++) {
      var page = pages[i];
      var pageComponent = new assemble.models.Component({
        src: page.name,
        name: page.name,
        orig: page.content
      });
      pageComponent.data = _.merge(pageComponent.data, page.data);

      options.pages.push(pageComponent);
    }


    assemble(options).build(function (err, results) {
      if (err) {
        done(err);
      }
      //console.log('results', results.pages.page1);
      var page = results.pages.page1;
      expect(page.content).to.eql(expected);
      done();
    });
  });

  it('should inject components as helpers into pages', function (done) {
    var options = {
      // log: { level: 'verbose', theme: 'socket.io' },
      pages: []
    };

    var pages = [
      {
        name: 'page1',
        data: {
          title: 'Page 1 Title',
          components: [
            {
              name: 'component-foo',
              content: '<div>Foo Component {{foo}}</div>'
            },
            {
              name: 'component-bar',
              content: '<div>Bar Component {{bar}}</div>'
            },
            {
              name: 'component-block',
              content: '<div>Block Component {{baz}}: {{yield}}</div>'
            }
          ]
        },
        content: [
          '<h1>{{title}}</h1>',
          '{{componentFoo foo="foo property 1"}}',
          '{{componentBar bar="bar property 1"}}',
          '{{componentFoo foo="foo property 2"}}',
          '{{#componentBlock baz="bang property"}}',
          '[From inner content: {{title}} - {{baz}}]',
          '{{/componentBlock}}'
        ].join('\n')
      }
    ];

    var expected = [
      '<h1>Page 1 Title</h1>',
      '<div>Foo Component foo property 1</div>',
      '<div>Bar Component bar property 1</div>',
      '<div>Foo Component foo property 2</div>',
      '<div>Block Component bang property: ',
      '[From inner content: Page 1 Title - ]',
      '</div>'
    ].join('\n');

    for (var i = 0; i < pages.length; i++) {
      var page = pages[i];
      var pageComponent = new assemble.models.Component({
        src: page.name,
        name: page.name,
        orig: page.content
      });
      pageComponent.data = _.merge(pageComponent.data, page.data);

      options.pages.push(pageComponent);
    }

    assemble(options).build(function (err, results) {
      if (err) {
        console.log('Error:', err);
      }
      //console.log(results.componentTree);
      var page = results.pages.page1;
      expect(expected).to.eql(page.content);
      done();
    });
  });

});
