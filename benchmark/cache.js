var grade = require('grade');

var Cache = require('config-cache');

var Benchmark = grade.Benchmark;

var options = {
  max: 1
};

// create a new instance of a Benchmark
var benchmark = new Benchmark(options);

var scoped = function (test, before, after) {
  before = before || function () {};
  after = after || function () {};
  var db = new Cache();
  return {
    before: before(db),
    test: test(db),
    after: after(db)
  };
};

// (function () {
//   console.log('Setting the same static value');
//   var db = new Cache();
//   var results = timing.execute(max, function () { db.set('foo', 'bar'); });
//   console.info('Execution time: %ds %dms', results.seconds, results.milliseconds/1000000);
//   console.info('Run count', results.counter);
// }());

var staticValue = scoped(function (db) {
  return function () { db.set('foo', 'bar');};
});
benchmark.add('Setting the same static value', staticValue.test);


// (function () {
//   console.log('Setting the same dynamic value');
//   var db = new Cache();
//   var counter = 0;
//   var results = timing.execute(
//     max,
//     function () { db.set('foo', counter); },
//     null,
//     function () { counter++; });
//   console.info('Execution time: %ds %dms', results.seconds, results.milliseconds/1000000);
//   console.info('Run count', results.counter, counter);
// }());

var dynamicValue = scoped(
  function (db) { return function () { db.set('foo', this.counter); }; },
  function (db) { return function () { this.counter = this.counter || 0 }; },
  function (db) { return function () { this.counter++; }; }
);
benchmark.add('Setting the same dynamic value', dynamicValue.test, dynamicValue.before, dynamicValue.after);


// (function () {
//   console.log('Setting the same static object');
//   var db = new Cache();
//   var object = {beep: 'boop'};
//   var results = timing.execute(max, function () { db.set('foo', object); });
//   console.info('Execution time: %ds %dms', results.seconds, results.milliseconds/1000000);
//   console.info('Run count', results.counter);
// }());


var staticObject = scoped(
  function (db) { return function () { db.set('foo', this.object); }; },
  function (db) { return function () { this.object = this.object || {beep: 'boop'}; }; }
);
benchmark.add('Setting the same static object', staticObject.test, staticObject.before, staticObject.after);


// (function () {
//   console.log('Setting the same dynamic object');
//   var db = new Cache();
//   var object = {beep: 'boop', counter: 0};
//   var results = timing.execute(
//     max,
//     function () { db.set('foo', object); },
//     null,
//     function () { object.counter++; });
//   console.info('Execution time: %ds %dms', results.seconds, results.milliseconds/1000000);
//   console.info('Run count', results.counter, object.counter);
// }());

var dynamicObject = scoped(
  function (db) { return function () { db.set('foo', this.object); }; },
  function (db) { return function () { this.object = this.object || {beep: 'boop', counter: 0}; }; },
  function (db) { return function () { this.object.counter++; }; }
);
benchmark.add('Setting the same dynamic object', dynamicObject.test, dynamicObject.before, dynamicObject.after);


// (function () {
//   console.log('Setting different keys and values');
//   var db = new Cache();
//   var counter = 0;
//   var key, value;
//   var results = timing.execute(
//     max,
//     function () { db.set(key, value); },
//     function () { key = String(counter); value = 'foo_' + counter; },
//     function () { counter++; }
//   );
//   console.info('Execution time: %ds %dms', results.seconds, results.milliseconds/1000000);
//   console.info('Run count', results.counter, counter);
// }());

var different = scoped(
  function (db) { return function () { db.set(this.key, this.value); }; },
  function (db) {
    return function () { 
      this.counter = this.counter || 0;
      this.key = String(this.counter);
      this.value = 'foo_' + this.counter;
    };
  },
  function (db) { return function () { this.counter++; }; }
);
benchmark.add('Setting different keys and values', different.test, different.before, different.after);

// (function () {
//   console.log('Setting the same static value with a listener');
//   var db = new Cache();
//   db.on(['foo', '*'], function () { });
//   var results = timing.execute(max, function () { db.set('foo', 'bar'); });
//   console.info('Execution time: %ds %dms', results.seconds, results.milliseconds/1000000);
//   console.info('Run count', results.counter);
// }());

// console.log();

// (function () {
//   console.log('Setting the same dynamic value with a listener');
//   var db = new Cache();
//   db.on(['foo', '*'], function () { });
//   var counter = 0;
//   var results = timing.execute(
//     max,
//     function () { db.set('foo', counter); },
//     null,
//     function () { counter++; });
//   console.info('Execution time: %ds %dms', results.seconds, results.milliseconds/1000000);
//   console.info('Run count', results.counter, counter);
// }());


// console.log();

// (function () {
//   console.log('Setting the same static object with a listener');
//   var db = new Cache();
//   db.on(['foo', '*'], function () { });
//   var object = {beep: 'boop'};
//   var results = timing.execute(max, function () { db.set('foo', object); });
//   console.info('Execution time: %ds %dms', results.seconds, results.milliseconds/1000000);
//   console.info('Run count', results.counter);
// }());


// console.log();

// (function () {
//   console.log('Setting the same dynamic object with a listener');
//   var db = new Cache();
//   db.on(['foo', '*'], function () { });
//   var object = {beep: 'boop', counter: 0};
//   var results = timing.execute(
//     max,
//     function () { db.set('foo', object); },
//     null,
//     function () { object.counter++; });
//   console.info('Execution time: %ds %dms', results.seconds, results.milliseconds/1000000);
//   console.info('Run count', results.counter, object.counter);
// }());

module.exports = benchmark;
