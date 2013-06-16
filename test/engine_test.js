var assembleEngine = require('../lib/engine'),
    engineHelpers = require('../lib/engine/helpers'),
    expect = require('chai').expect;

describe('Loading default handlebars engine', function() {

  it('loads handlebars engine', function(done) {
    var engine = assembleEngine.load('handlebars');
    done();
  });

  it('compiles a handlebars template', function(done) {
    var engine = assembleEngine.load('handlebars');
    var template;
    engine.compile('{{foo}}', null, function(err, tmpl) {
      if(err) {
        console.log('error: ' + err);
        done(false);
      }
      template = tmpl;
      done();
    });
  });

  it('renders a template', function(done) {
    var engine = assembleEngine.load('handlebars');
    var expected = 'bar';
    engine.compile('{{foo}}', null, function(err, tmpl) {
      if(err) {
        console.log('error: ' + err);
        done(false);
      }
      engine.render(tmpl, {foo: 'bar'}, function(err, content) {
        if(err) {
          console.log('error: ' + err);
          done(false);
        }
        expect(content).to.equal(expected);
        done();
      });
    });
  });

  describe('Loading custom helpers', function() {

    var runTest = function(engine, done) {
      var expected = '<!-- bar -->';
      engine.compile("{{{foo 'bar'}}}", null, function(err, tmpl) {
        if(err) {
          console.log('error: ' + err);
          done(false);
        }
        engine.render(tmpl, {}, function(err, content) {
          if(err) {
            console.log('error: ' + err);
            done(false);
          }
          expect(content).to.equal(expected);
          done();
        });
      });
    };

    it('loads a custom helper from a file path', function(done) {
      var engine = assembleEngine.load('handlebars');
      engine.init({
        cwd: __dirname,
        helpers: './helpers/helpers.js'
      });
      runTest(engine, done);
    });

    it('loads a custom helper from a glob pattern', function(done) {
      var engine = assembleEngine.load('handlebars');
      engine.init({
        cwd: __dirname,
        helpers: './helpers/**/*.js'
      });
      runTest(engine, done);
    });

    it('loads a custom helper without needing to set the cwd', function(done) {
      var engine = assembleEngine.load('handlebars');
      engine.init({helpers: './test/helpers/**/*.js'});
      var expected = '<!-- foo2 -->\n<!-- bar -->';
      engine.compile("{{{foo2 'bar'}}}", null, function(err, tmpl) {
        if(err) {
          console.log('error: ' + err);
          done(false);
        }
        engine.render(tmpl, {}, function(err, content) {
          if(err) {
            console.log('error: ' + err);
            done(false);
          }
          expect(content).to.equal(expected);
          done();
        });
      });
    });

  });

});
