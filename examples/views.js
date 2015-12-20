var assemble = require('../');

var Views = assemble.Views;
var views = new Views();

views.addView({path: 'a', contents: 'aaa'});
views.addView({path: 'b', contents: 'bbb'});
views.addView({path: 'c', contents: 'ccc'});
console.log(views)
