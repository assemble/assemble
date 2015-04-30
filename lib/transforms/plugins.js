'use strict';

/**
 * Settings for Assemble's default plugins.
 */

module.exports = function plugins_(assemble) {
  // default `src` plugins
  assemble.enable('src:vfs plugin');
  assemble.enable('src:init plugin');
  assemble.enable('src:drafts plugin');

  // default `dest` plugins
  assemble.enable('dest:paths plugin');
  assemble.enable('dest:render plugin');
  assemble.enable('dest:vfs plugin');
};
