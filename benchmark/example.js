
/**
 * Example of using grade for benchmarking
 */

var grade = require('grade');

// create a new instance of a Benchmark
var Benchmark = grade.Benchmark;

// can pass in an optional max seconds to run
var benchmark = new Benchmark(/*{max: 10}*/);

// setup a before method
var beforeI = 0;
function before () {
  beforeI++;
}

// setup an after method
var afterI = 0;
function after () {
  afterI++;
}

// setup the actual method under test
var total = 0;
var test = function () {
  var i = 0;
  while ((i++) < 50000) {}
  total += (beforeI + afterI);
};

// add the new benchmark
benchmark.add('example', test, before, after);

module.exports = benchmark;