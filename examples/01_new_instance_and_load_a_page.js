
var Assemble = require('../lib/assemble');
var assemble = new Assemble();
console.log(assemble);
console.log();

assemble.page('foo.hbs', 'This is something');
console.log(assemble.cache.pages);