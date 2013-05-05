
var utils = {};
utils.data = require('../data');

var EngineFactory = function() {

  var engine = null;
  var engineName = '';

  var functionExists = function(fn) {
    var getType = {};
    return fn && getType.toString.call(fn) === '[object Function]';
  };

  var tryRequireEngine = function(eng) {
    try {
      engine = require('assemble-' + eng);
    } catch(ex1) {
      try {
        engine = require(eng);
      } catch(ex2) {
        console.log('Error loading engine: ' + eng);
        console.log(ex2);
      }
    }
  };

  var load = function(eng) {
    engineName = eng;
    tryRequireEngine(eng);
    if(!engine) {
      return false;
    }
    return this;
  };

  var compile = function(src, options, callback) {
    if(!functionExists(engine.compile)) {
      console.log(engineName + ' does not support compile.');
      callback(engineName + ' does not support compile.', null);
    }
    engine.compile(src, options, callback);
  };

  var render = function(tmpl, options, callback) {
    if(!functionExists(engine.render)) {
      console.log(engineName + ' does not support render.');
      callback(engineName + ' does not support render.', null);
    }
    engine.render(tmpl, options, callback);
  };

  var registerFunctions = function() {
    if(functionExists(engine.registerFunctions)) {
      engine.registerFunctions();
    }
  };

  var registerPartial = function(filename, content) {
    if(functionExists(engine.registerPartial)) {
      engine.registerPartial(filename, content);
    }
  };

  return {
    load: load,
    compile: compile,
    render: render,
    registerFunctions: registerFunctions,
    registerPartial: registerPartial
  };

};

module.exports = exports = new EngineFactory();
