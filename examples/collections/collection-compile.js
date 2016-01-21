var path = require('path');
var templates = require('..');
var Views = templates.Views;

var pages = new Views({
  renameKey: function(key) {
    return path.basename(key);
  }
});

pages.engine('txt', require('engine-base'));

pages.preCompile(/./, function(view, next) {
  view.engine = 'txt';
  next();
});

pages.addViews({
  'a': {content: 'a <%= title %> b', locals: {title: 'aaa'}},
  'b': {content: 'a <%= title %> b', locals: {title: 'bbb'}},
  'c': {content: 'a <%= title %> b', locals: {title: 'ccc'}},
  'd': {content: 'a <%= title %> b', locals: {title: 'ddd'}},
  'e': {content: 'a <%= title %> b', locals: {title: 'eee'}},
  'f': {content: 'a <%= title %> b', locals: {title: 'fff'}},
  'g': {content: 'a <%= title %> b', locals: {title: 'ggg'}},
  'h': {content: 'a <%= title %> b', locals: {title: 'hhh'}},
  'i': {content: 'a <%= title %> b', locals: {title: 'iii'}},
  'j': {content: 'a <%= title %> b', locals: {title: 'jjj'}},
});

var view = pages.compile('a');
console.log(view.fn({title: 'foo'}))
