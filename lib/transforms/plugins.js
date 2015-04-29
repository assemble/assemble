'use strict';

/**
 * Settings for Assemble's default plugins.
 */

module.exports = function plugins_(assemble) {
  // enable all plugins by default
  assemble.disable('minimal config');

  // default `src` plugins
  assemble.enable('src:init plugin');
  assemble.enable('src:assets plugin');
  assemble.enable('src:drafts plugin');

  // default `dest` plugins
  assemble.enable('dest:paths plugin');
  assemble.enable('dest:render plugin');
};
