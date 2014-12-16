/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var Template = require('template');

module.exports = function (Assemble) {
  Assemble.onCreate(Template);
  Assemble = Template.extend(Assemble.prototype);

  /**
   * A session context specific `files` property that returns the `files` collection
   * being used in the current `task`.
   *
   * ```js
   * console.log(assemble.files);
   * //=>
   * { home:
   *   {
   *     base: '/site/template/pages/',
   *     content: '{{ msg }}',
   *     cwd: '/site',
   *     data: { msg: 'hello world', src: [Object], dest: [Object] },
   *     options: {},
   *     orig: '{{ msg }}',
   *     path: '/site/template/pages/home.hbs',
   *     relative: 'home.hbs'
   *   }
   * }
   * ```
   *
   * @return {Object} Template files from current task.
   * @api public
   */

  Object.defineProperty(Assemble.prototype, 'files', {
    enumerable: true,
    configurable: true,
    get: function () {
      var taskName = this.session.get('task name');
      var templateType = 'page';
      if (taskName) {
        templateType = '__task__' + taskName;
      }
      var plural = this.collection[templateType];
      return this.views[plural];
    }
  });

  return Assemble;
};
