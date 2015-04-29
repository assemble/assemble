'use strict';

/**
 * Adds data to the context for the current `assemble.runner`.
 */

module.exports = function runner_(assemble) {
  assemble.data({
    runner: {
      name: 'assemble',
      url: 'https://github.com/assemble/assemble'
    }
  });
};
