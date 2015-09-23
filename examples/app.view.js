var assemble = require('../');
var app = assemble();

var post = app.view({path: 'foo', contents: 'bar'});
console.log(post)
