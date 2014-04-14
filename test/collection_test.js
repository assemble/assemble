

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

describe('collections', function() {

  var createCollection = function(options) {
    options = options || {};
    options.name = options.name || 'tests';
    return new assemble.models.Collection(options);
  };

  it('should create a collection object', function() {
    var actual = createCollection();
    expect(actual).to.be.an.instanceof(assemble.models.Collection);
  });

  it('should have metadata about the collection', function () {
    var collection = createCollection();

    expect(collection).to.have.property('name');
    expect(collection).to.have.property('inflection');
    expect(collection).to.have.property('items');
    expect(collection).to.have.property('options');

    expect(collection.name).to.eql('tests');
    expect(collection.inflection).to.eql('test');

  });

  it('should add an item', function () {
    var collection = createCollection();

    collection.add(new assemble.models.Component({
      name: 'test-component-1'
    }));

    expect(collection.items.length).to.eql(1);
  });

  it('should return an item by name', function () {
    var collection = createCollection();
    collection.add(new assemble.models.Component({name: 'foo'}));
    collection.add(new assemble.models.Component({name: 'bar'}));
    var actual = collection.get('foo');
    expect(actual.name).to.eql('foo');
  });

  it('should return an item by source', function () {
    var collection = createCollection();
    collection.add(new assemble.models.Component({src: 'path/to/foo.hbs', name: 'foo'}));
    collection.add(new assemble.models.Component({src: 'path/to/bar.hbs', name: 'bar'}));
    var actual = collection.get('path/to/foo.hbs');
    expect(actual.name).to.eql('foo');
    expect(actual.src).to.eql('path/to/foo.hbs');
  });

  it('should return an item by a value on a property in the metadata', function () {
    var collection = createCollection();
    collection.add(new assemble.models.Component({
      src: 'path/to/one.hbs',
      name: 'one',
      metadata: {
        city: 'Cincinnati'
      }
    }));
    collection.add(new assemble.models.Component({
      src: 'path/to/two.hbs',
      name: 'two',
      metadata: {
        city: 'Cleveland'
      }
    }));
    collection.add(new assemble.models.Component({
      src: 'path/to/three.hbs',
      name: 'three',
      metadata: {
        city: 'Convington'
      }
    }));

    var actual = collection.get('Cincinnati', 'city');
    expect(actual.name).to.eql('one');
    expect(actual.metadata.city).to.eql('Cincinnati');
  });

  it('should return an item by a value on a namespaced property in the metadata', function () {
    var collection = createCollection();
    collection.add(new assemble.models.Component({
      src: 'path/to/one.hbs',
      name: 'one',
      metadata: {
        address: {
          city: 'Cincinnati'
        }
      }
    }));
    collection.add(new assemble.models.Component({
      src: 'path/to/two.hbs',
      name: 'two',
      metadata: {
        address: {
          city: 'Cleveland'
        }
      }
    }));
    collection.add(new assemble.models.Component({
      src: 'path/to/three.hbs',
      name: 'three',
      metadata: {
        address: {
          city: 'Convington'
        }
      }
    }));

    var actual = collection.get('Cincinnati', 'address.city');
    expect(actual.name).to.eql('one');
    expect(actual.metadata.address.city).to.eql('Cincinnati');
  });

  it('should return an item by a custom function', function () {
    var collection = createCollection();
    collection.add(new assemble.models.Component({
      src: 'path/to/one.hbs',
      name: 'one',
      metadata: {
        address: {
          city: 'Cincinnati',
          state: 'OH'
        }
      }
    }));
    collection.add(new assemble.models.Component({
      src: 'path/to/two.hbs',
      name: 'two',
      metadata: {
        address: {
          city: 'Cleveland',
          state: 'oh'
        }
      }
    }));
    collection.add(new assemble.models.Component({
      src: 'path/to/three.hbs',
      name: 'three',
      metadata: {
        address: {
          city: 'Convington',
          state: 'KY'
        }
      }
    }));

    var actual = collection.get(function(page) {
      return page.metadata.address.state === 'OH';
    });
    expect(actual.name).to.eql('one');
    expect(actual.metadata.address.city).to.eql('Cincinnati');
  });

});
