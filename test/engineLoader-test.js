/*global require:true */
var utils = require('../lib/assemble.js').Utils,
    expect = require('chai').expect;

describe('Engine Loader tests', function() {


  it("load handlebars engine", function(done) {
    var EngineLoader = utils.EngineLoader({});
    var engine = null;
    EngineLoader.getEngine(function(err, results) {
      if(err) {
        console.log(err);
        return;
      }
      engine = results;
    });
    expect(engine).to.not.equal(null);
    done();
  });


  it("load handlebars engine with helpers", function(done) {
    var EngineLoader = utils.EngineLoader({
      helpers: [
        'defaultHelpers'
      ]
    });
    var engine = null;
    EngineLoader.getEngine(function(err, results) {
      if(err) {
        console.log(err);
        return;
      }
      engine = results;
    });
    expect(engine).to.not.equal(null);
    done();
  });


  it("loads handlebars engine with preprocessors", function(done) {
    var EngineLoader = utils.EngineLoader({});
    var engine = null;
    EngineLoader.getEngine(function(err, results) {
      if(err) {
        console.log(err);
        return;
      }
      engine = results;
    });
    expect(engine).to.not.equal(null);
    done();
  });


  it("loads handlebars engine with helpers and preprocessors", function(done) {
    var EngineLoader = utils.EngineLoader({
      engine: 'handlebars'
    });
    var engine = null;
    EngineLoader.getEngine(function(err, results) {
      if(err) {
        console.log(err);
        return;
      }
      engine = results;
    });
    expect(engine).to.not.equal(null);
    done();
  });


  it("gets a yaml preprocessor from the engine", function(done) {
    var EngineLoader = utils.EngineLoader({
      engine: 'handlebars'
    });
    var engine = null;
    EngineLoader.getEngine(function(err, results) {
      if(err) {
        console.log(err);
        return;
      }
      engine = results;
    });
    expect(engine).to.not.equal(null);

    var yaml = EngineLoader.getPreprocessor('YamlPreprocessor');
    console.log(yaml);
    expect(yaml).to.not.equal(null);
    done();
  });

});
