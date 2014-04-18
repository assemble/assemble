
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
var _ = require('lodash');

var assemble = require('../');

describe('page components', function() {

  it('should register partials as ember style components', function (done) {
    var options = {
      name: 'ember-style-components-test-1',
      metadata: {
        partials: ['test/fixtures/templates/includes/*.hbs'],
        components: []
      }
    };

    var pages = [
      {
        name: 'page1',
        metadata: {
          title: 'Page 1 Title'
        },
        content: [
          '<h1>{{title}}</h1>',
          '<h2>Button</h2>',
          '{{btn class="btn"}}',
          '<h2>Alert</h2>',
          '{{alert class="alert alert-warning fade in"}}'
        ].join('\n')
      }
    ];

    var expected = [
      '<h1>Page 1 Title</h1>',
      '<h2>Button</h2>',
      '',
      '',
      '<button class="btn"></button>',
      '',
      '<h2>Alert</h2>',
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
      var component = new assemble.models.Component({
        src: page.name,
        name: page.name,
        raw: page.content
      });
      component.metadata = _.merge(component.metadata, page.metadata);

      options.metadata.components.push(component);
    }

    assemble(options).build(function (err, results) {
      if (err) {
        console.log('Error:', err);
      }
      //console.log('results', results.components.page1);
      var component = results.components.page1;
      expect(expected).to.eql(component.content);
      done();
    });
  });

  it('should inject components as helpers into pages', function (done) {
    var options = {
      name: 'page-components-test-1',
      metadata: {
        // log: { level: 'verbose', theme: 'socket.io' },
        components: []
      }
    };

    var pages = [
      {
        name: 'page1',
        metadata: {
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
      var component = new assemble.models.Component({
        src: page.name,
        name: page.name,
        raw: page.content
      });
      component.metadata = _.merge(component.metadata, page.metadata);

      options.metadata.components.push(component);
    }

    assemble(options).build(function (err, results) {
      if (err) {
        console.log('Error:', err);
      }
      //console.log(results.componentTree);
      var component = results.components.page1;
      expect(expected).to.eql(component.content);
      done();
    });
  });

});
