'use strict';

var rename = require('./rename');
var utils = require('./utils');

module.exports = function chooseFiles(config) {
  return function plugin(app) {
    if (!this.isApp && !this.isGenerator && !this.isViews) {
      return;
    }
    if (this.isRegistered('choose-files')) return;

    this.define('chooseFiles', function(options, cb) {
      if (typeof options === 'function') {
        cb = options;
        options = {};
      }

      if (typeof this.ask === 'undefined') {
        cb(new Error('expected the base-questions plugin to be registered'));
        return;
      }

      var opts = utils.merge({}, config, this.options, options);
      this.use(utils.conflicts(opts));
      this.use(rename(opts));

      var name = opts.collection || 'templates';
      var dest = opts.dest || this.cwd || process.cwd();
      var ext = opts.engine || '*';
      var self = this;

      var views = this.getViews(name);
      if (typeof views === 'undefined') {
        cb(new Error('cannot find collection ' + name));
        return;
      }

      var keys = Object.keys(views);
      if (!keys.length) {
        cb(new Error('no views found in collection: ' + name));
        return;
      }

      if (keys.length === 1) {
        return self.toStream(name, keys)
          .pipe(self.renderFile(ext, opts))
          .pipe(self.renameFile(opts.renameFile))
          .pipe(self.conflicts(dest))
          .pipe(self.dest(dest))
          .on('end', cb);
      }

      // setup a `choices` questions
      this.choices('files', keys);

      // ask the question
      this.ask('files', function(err, answers) {
        if (err) return cb(err);

        if (answers.files && answers.files.length) {
          self.toStream(name, filter(opts, answers.files))
            .pipe(self.renderFile(ext, opts))
            .pipe(self.renameFile(opts.renameFile))
            .pipe(self.conflicts(dest))
            .pipe(self.dest(dest))
            .on('end', cb);

        } else {
          console.log('no files chosen');
          cb();
        }
      });
    });

    return plugin;
  };
};

function filter(opts, arr) {
  if (typeof opts.filter === 'function') {
    return opts.filter(arr);
  }
  return arr;
}
