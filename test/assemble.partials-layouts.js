// /**
//  * Assemble <http://assemble.io>
//  *
//  * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
//  * Licensed under the MIT License (MIT).
//  */

// 'use strict';

// var fs = require('graceful-fs');
// var path = require('path');
// var should = require('should');
// var File = require('vinyl');
// var rimraf = require('rimraf');
// var assemble = require('..');

// var actual = __dirname + '/layouts-actual';


// describe('assemble partials-layouts', function () {
//   beforeEach(function (done) {
//     assemble.init();
//     rimraf(actual, done);
//   });
//   afterEach(function (done) {
//     rimraf(actual, done);
//   });


//   it('should use layouts defined in partials', function (done) {
//     assemble.layouts([
//       {
//         name: 'default',
//         data: {title: 'Default Layout'},
//         content: 'LAYOUT A {{body}} LAYOUT A'
//       },
//       {
//         name: 'slide',
//         data: {title: 'Slide Layout', layout: 'default'},
//         content: 'SLIDE A {{body}} SLIDE A'
//       },
//       {
//         name: 'LAAA',
//         data: {title: 'Layout AAA', layout: 'LAAA'},
//         content: 'LAYOUT A {{body}} LAYOUT A'
//       },
//       {
//         name: 'LBBB',
//         data: {title: 'Layout BBB', layout: 'LBBB'},
//         content: 'LAYOUT B {{body}} LAYOUT B'
//       },
//       {
//         name: 'LCCC',
//         data: {title: 'Layout CCC', layout: 'default'},
//         content: 'LAYOUT C {{body}} LAYOUT C'
//       }
//     ]);

//     var layouts = assemble.cache.layouts;
//     layouts.should.have.property('LAAA');
//     layouts.should.have.property('LBBB');
//     layouts.should.have.property('LCCC');

//     assemble.partials([
//       {
//         name: 'P111',
//         data: {title: 'P111', layout: 'slide'},
//         content: 'Partial 111 content'
//       },
//       {
//         name: 'P222',
//         data: {title: 'P222', layout: 'slide'},
//         content: 'Partial 222 content'
//       },
//       {
//         name: 'P333',
//         data: {title: 'P333', layout: 'slide'},
//         content: 'Partial 333 content'
//       }
//     ]);

//     var partials = assemble.cache.partials;
//     partials.should.have.property('P111');
//     partials.should.have.property('P222');
//     partials.should.have.property('P333');

//     assemble.pages([
//       {
//         name: 'PAGE111',
//         data: {title: 'PAGE111', layout: 'LAAA'},
//         content: 'Partial 111 content'
//       },
//       {
//         name: 'PAGE222',
//         data: {title: 'PAGE222', layout: 'LAAA'},
//         content: 'Partial 222 content'
//       },
//       {
//         name: 'PAGE333',
//         data: {title: 'PAGE333', layout: 'LAAA'},
//         content: 'Partial 333 content'
//       }
//     ]);

//     var pages = assemble.cache.pages;
//     pages.should.have.property('PAGE111');
//     pages.should.have.property('PAGE222');
//     pages.should.have.property('PAGE333');

//     // var instream = assemble.src(path.join(__dirname, 'fixtures/templates/with-helpers/*.hbs'));
//     // var outstream = assemble.dest(actual);
//     // instream.pipe(outstream);

//     // outstream.on('error', done);
//     // outstream.on('data', function (file) {
//     //   should.exist(file);
//     //   should.exist(file.path);
//     //   should.exist(file.contents);
//     //   /none:\s+([abcd])/.test(String(file.contents)).should.be.true;
//     //   /helper:\s+[ABCD]/.test(String(file.contents)).should.be.true;
//     //   /foo[abcd]/.test(String(file.contents)).should.be.true;
//     // });

//     // outstream.on('end', function () {
//     //   done();
//     // });
//   });
// });
