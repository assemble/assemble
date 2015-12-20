var assemble = require('../');

var List = assemble.List;
var list = new List();

list.addItem({path: 'a', content: 'aaa'});
list.addItem({path: 'b', content: 'bbb'});
list.addItem({path: 'c', content: 'ccc'});
list.addItem({path: 'd', content: 'ddd'});
list.addItem({path: 'e', content: 'eee'});
console.log(list);
