

var Scaffold = require('template');
var scaffold = new Scaffold();


scaffold.create('pages');
scaffold.create('posts');
scaffold.create('layouts');

scaffold.layouts('docs/scaffolds/layouts/*.hbs');

module.exports = scaffold.views;
