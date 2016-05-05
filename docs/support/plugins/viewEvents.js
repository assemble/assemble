'use strict';

/**
 * Returns a plugin function that adds a handler for the `eventName`
 * and bubbles events from a `view` to the `app`
 */

module.exports = function viewEvents(eventName) {
  var method = 'on'
    + eventName.charAt(0).toUpperCase()
    + eventName.slice(1);

  return function(app) {
    if (!app.isApp) return;
    if (!(method in app)) {
      app.handler(method);
    }

    app.use(function(app) {
      return function(views) {
        return function() {
          this.on(eventName, function(view) {
            app.emit(eventName, view);
            app.handle(method, view);
          });
        };
      };
    });
  };
};
