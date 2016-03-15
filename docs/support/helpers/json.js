'use strict';

module.exports = function(obj) {
  try {
    return JSON.stringify(obj);
  } catch (err) {}
  return '';
};
