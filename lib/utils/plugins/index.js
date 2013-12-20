/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */

var plugins = module.exports = {};

plugins.Plugin = require('./plugin');
plugins.PluginHandler = require('./pluginHandler');

// plugin events that we emit
plugins.stages = {
  optionsPreConfiguration: 'options:pre:configuration',
  optionsPostConfiguration: 'options:post:configuration',
  assemblePreLayout: 'assemble:pre:layout',
  assemblePostLayout: 'assemble:post:layout',
  assemblePrePartials: 'assemble:pre:partials',
  assemblePostPartials: 'assemble:post:partials',
  assemblePreData: 'assemble:pre:data',
  assemblePostData: 'assemble:post:data',
  assemblePrePages: 'assemble:pre:pages',
  assemblePrePage: 'assemble:pre:page',
  assemblePostPage: 'assemble:post:page',
  assemblePostPages: 'assemble:post:pages',
  renderPrePages: 'render:pre:pages',
  renderPrePage: 'render:pre:page',
  renderPostPage: 'render:post:page',
  renderPostPages: 'render:post:pages'
};
