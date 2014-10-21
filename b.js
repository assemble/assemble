
var assemble = require('./');
// console.log(assemble);
console.log();

assemble.page('foo.hbs', 'From b');
console.log(assemble.cache.pages);

assemble.enable('minimal config');

assemble.src('./test/fixtures/templates/no-helpers/*.hbs')
  .pipe(assemble.dest('_test_b'));