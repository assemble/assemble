// 'use strict';

// var assemble = require('..');
// var should = require('should');
// var join = require('path').join;
// var rimraf = require('rimraf');
// var fs = require('graceful-fs');
// var path = require('path');
// require('mocha');

// var outpath = join(__dirname, './out-fixtures');


// describe('assemble route', function() {

//   describe('route()', function() {
//     beforeEach(function (done) {
//       site.init();
//       rimraf(outpath, done);
//     });
//     afterEach(function (done) {
//       rimraf(outpath, done);
//     });

//     it('should set route for all text files', function (done) {
//       var called = 0;
//       site.route(/\.txt/, function (file, next) {
//         called++;
//         file.contents = new Buffer(file.contents.toString().toUpperCase());
//         next();
//       });

//       var instream = site.src(join(__dirname, 'fixtures/routes/*.txt'));
//       var outstream = site.dest(outpath);
//       instream.pipe(outstream);

//       outstream.on('error', done);
//       outstream.on('data', function (file) {
//         should.exist(file);
//         should.exist(file.path);
//         should.exist(file.contents);
//         join(file.path, '').should.equal(join(outpath, 'example.txt'));
//         String(file.contents).should.equal('THIS IS A TEST');
//       });

//       outstream.on('end', function () {
//         called.should.equal(1);
//         done();
//       });
//     });

//     it('should set multiple routes on different files', function (done) {

//       var called = {};
//       var checked = 0;
//       site.route(/\.txt/, function (file, next) {
//         called['.txt'] = file.path;
//         file.contents = new Buffer(file.contents.toString().toUpperCase());
//         next();
//       });

//       site.route(/\.hbs/, function (file, next) {
//         called['.hbs'] = file.path;
//         file.ext = '.html';
//         next();
//       });

//       var instream = site.src(join(__dirname, 'fixtures/routes/*.*'));
//       var outstream = site.dest(outpath);
//       instream.pipe(outstream);

//       outstream.on('error', done);
//       outstream.on('data', function (file) {
//         should.exist(file);
//         should.exist(file.path);
//         should.exist(file.contents);

//         var file1 = join(outpath, 'example.html');
//         var file2 = join(outpath, 'example.txt');

//         if (file.path === file1) {
//           checked++;
//           join(file.path, '').should.equal(file1);
//           String(file.contents).should.equal('this is a test');
//         }

//         if (file.path === file2) {
//           checked++;
//           join(file.path, '').should.equal(file2);
//           String(file.contents).should.equal('THIS IS A TEST');
//         }

//       });

//       outstream.on('end', function () {
//         called.should.eql({
//           '.txt': join(__dirname, 'fixtures/routes/example.txt'),
//           '.hbs': join(__dirname, 'fixtures/routes/example.hbs')
//         });
//         checked.should.equal(2);
//         done();
//       });
//     });

//     it('should set multiple routes on same file', function (done) {
//       var called = 0;
//       site.route(/\.txt/, function (file, next) {
//         called++;
//         file.contents = new Buffer(file.contents.toString().toUpperCase());
//         next();
//       });

//       site.route(/example/, function (file, next) {
//         called++;
//         file.ext = '.html';
//         next();
//       });

//       var instream = site.src(join(__dirname, 'fixtures/routes/*.txt'));
//       var outstream = site.dest(outpath);
//       instream.pipe(outstream);

//       outstream.on('error', done);
//       outstream.on('data', function (file) {
//         should.exist(file);
//         should.exist(file.path);
//         should.exist(file.contents);
//         join(file.path, '').should.equal(join(outpath, 'example.html'));
//         String(file.contents).should.equal('THIS IS A TEST');
//       });

//       outstream.on('end', function () {
//         called.should.equal(2);
//         done();
//       });
//     });

//     it('should handle errors', function (done) {

//       var called = 0;

//       site.route(/\.hbs/, function (file, next) {
//         called++;
//         throw new Error('This is an error');
//         next();
//       }, function (err, file, next) {
//         called++;
//         should.exist(err);
//         err.message.should.equal('This is an error');
//         next();
//       });

//       var instream = site.src(join(__dirname, 'fixtures/routes/*.*'));
//       var outstream = site.dest(outpath);
//       instream.pipe(outstream);

//       outstream.on('error', done);
//       outstream.on('data', function (file) {
//         should.exist(file);
//         should.exist(file.path);
//         should.exist(file.contents);
//       });

//       outstream.on('end', function () {
//         called.should.equal(2);
//         done();
//       });
//     });


//     it('should set routes with custom router', function (done) {
//       var called = 0;
//       var foo = site.router();
//       foo.route(/\.txt/, function (file, next) {
//         called++;
//         file.contents = new Buffer('foo: ' + file.contents.toString().toUpperCase());
//         next();
//       });

//       var instream = site.src(join(__dirname, 'fixtures/routes/*.txt'));
//       var outstream = site.dest(outpath);

//       instream
//         .pipe(foo())
//         .pipe(outstream);

//       outstream.on('error', done);
//       outstream.on('data', function (file) {
//         should.exist(file);
//         should.exist(file.path);
//         should.exist(file.contents);
//         join(file.path, '').should.equal(join(outpath, 'example.txt'));
//         String(file.contents).should.equal('foo: THIS IS A TEST');
//       });

//       outstream.on('end', function () {
//         called.should.equal(1);
//         done();
//       });
//     });

//   });
// });
