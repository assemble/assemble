var assemble = require('../');

var Views = assemble.Views;
var views = new Views();

views.addView({path: 'a', contents: 'aaa'});
views.addView({path: 'b', contents: 'bbb'});
views.addView({path: 'c', contents: 'ccc'});
views.addView({path: 'd', contents: 'ddd'});
views.addView({path: 'e', contents: 'eee'});
console.log(views)

var List = assemble.List;
var list = new List(views);
console.log(list);
