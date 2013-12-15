/**
 * Data Utils
 */

// Node.js
var path = require('path');
var fs = require('fs');

var traverse = require('traverse');
var _ = require('lodash');

var Data = require('../data');

var generateFilename = function(name) {
  return path.join(process.cwd(), '.assemble', 'data', name);
};

// The module to be exported.
var data = module.exports = {};

data.loadDatastore = function(name) {
  var filename = generateFilename(name);
  return new Data({filename: filename});
};

data.destroyDatastore = function(name, done) {
  if(!done) {
    done = function() {};
  }
  
  var filename = generateFilename(name);
  fs.exists(filename, function(exists) {
    if(exists) {
      fs.unlink(filename, function(err) {
        done();
      });
    } else {
      done();
    }
  });
};

// following regex is from grunt.config template processing
var tmplRegex = /^<%=\s*([a-z0-9_$]+(?:\.[a-z0-9_$]+)*)\s*%>$/i;

// TODO: create function template regex to call a function instead of just
// doing _.template().
// If the function returns an object or an array, add that instead
// of the returned string.
var fnTmplRegex = /^<%(?:=?)\s*(([a-z0-9_$]+(?:\.[a-z0-9_$]+)*)\s*(\(\s*([^\)]*)\)))\s*%>$/i;
var stripCommentsRegex = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

/**
 * Recursively process lodash templates if values
 * @param  {Object} obj - object with possible values that need processing
 * @return {Object}     - returns a new object with processed values
 */
data.process = function(obj) {
  // will it be extended over obj first?
  return traverse(obj).map(function(o) {
    var matches = false;
    if(typeof o === 'string') {
      if(matches = o.match(tmplRegex)) {
        console.log('tmpl', matches);
        //this.update((matches[0] === o) ? data.get(obj, matches[1]) : _.template(o, obj));
        this.update(data.get(obj, matches[1]));
      } else if (matches = o.match(fnTmplRegex)) {
        console.log('fn', matches);
        var args = matches[4].split(',');
        var evalArgs = [];
        _.map(args, function(arg) {
          var value = data.get(obj, arg.trim());
          console.log(arg + ' => ' + (typeof arg));
          console.log(arg + ' => ' + data.get(obj, arg.trim()));
          evalArgs.push((typeof value) === 'undefined' ? arg.trim() : value);
        });
        console.log(evalArgs);

        var fnBody = 'return ' + matches[2] + '(' + evalArgs.join(', ') + ');';
        console.log(fnBody);

        var result = Function(['_'], fnBody).apply(undefined, [_]);

        console.log('result', result);

        this.update(_.template(o, obj));
      } else {
        this.update(_.template(o, obj));
      }
    }
  });
};

data.get = function(obj, path) {
  return traverse(obj).get(path.split('.'));
};

data.set = function(obj, path, value) {
  return traverse(obj).set(path.split('.'), value);
};
