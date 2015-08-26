'use strict';

var fs = require('fs');
var path = require('path');
var Scaffold = require('scaffold');
var scaffold = new Scaffold();


scaffold.create('templates')
  .create('styles')
  .create('scripts')
  .create('data');

scaffold.register('post')
  .templates('*')

var sidenav = {
  data: 'a/b/c.json',
  css: 'a/b/c.css',
  hbs: 'a/b/c.hbs'
};




scaffold.register('component');
scaffold.component
  .create('templates')
  .create('styles')
  .create('scripts');
scaffold.component
  .templates('fixtures/scaffolds/templates/*.hbs')
  .styles('fixtures/scaffolds/styles/*.hbs')
  .scripts('fixtures/scaffolds/scripts/*.hbs');

scaffold.generate('templates', {}, 'dest');


scaffold.register('blog');
scaffold.blog
  .create('templates')
  .create('styles')
  .create('scripts');
scaffold.blog
  .templates('fixtures/scaffolds/templates/*.hbs')
  .styles('fixtures/scaffolds/styles/*.hbs')
  .scripts('fixtures/scaffolds/scripts/*.hbs');
