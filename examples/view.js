var assemble = require('../');

var View = assemble.View;
var view = new View({path: 'foo', content: 'foo bar baz'});
console.log(view)
