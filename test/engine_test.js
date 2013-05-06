var assembleEngine = require('../lib/engine');
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

});
