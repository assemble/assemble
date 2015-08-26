


module.exports = function is(a, b, options) {
  if (arguments.length !== 3) {
    console.log('`is` helper is missing an argument. start by looking in: ' + this.context.view.path);
  }
  if (a === b) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};
