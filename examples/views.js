var assemble = require('../');

var Views = assemble.Views;
var views = new Views();

views.addView({path: 'foo', contents: 'bar'});
console.log(views)
