// 'use strict';

// /**
//  * Module dependencies
//  */

// var path = require('path');
// var compute = require('computed-property');
// var relative = require('relative-dest');
// var extend = require('extend-shallow');

// /**
//  * Calculate the path from the `assets` or `public`
//  * path define on the options to the destination
//  * file.
//  */

// module.exports = function(assemble) {
//   return function assetsPath(file, next) {
//     calculate(assemble, file, 'assets');
//     calculate(assemble, file, 'public');
//     next();
//   };
// };

// function calculate(assemble, file, target) {
//   compute(file.data, target, function () {
//     var opts = extend({}, assemble.options, file.options);

//     // destination directory for the file
//     var dest = path.resolve(this.dest.dirname || process.cwd());
//     target = path.resolve(dest, opts[target] || target);

//     // look for `opts.assets`, fallback to `./assets`
//     this.assetsPath = relative(dest, target);
//     return this.assetsPath;
//   });
// }
