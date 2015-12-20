var assemble = require('../');

var Views = assemble.Views;
var views = new Views();

views.addView({path: 'a', content: 'aaa'});
views.addView({path: 'b', content: 'bbb'});
views.addView({path: 'c', content: 'ccc'});
views.addView({path: 'd', content: 'ddd'});
views.addView({path: 'e', content: 'eee'});
console.log(views)


var List = assemble.List;
var list = new List(views);
console.log(list);
