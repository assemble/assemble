The most basic parser requires only the following:

```js
module.exports = function (file) {
  file;
};
```


**Example:**

```js
var remarked = require('remarked');

module.exports = function (file, encoding, options) {
  if (/\.md/.test(file.path)) {
    var str = file.contents.toString(encoding);
    // convert markdown to HTML with remarked
    file.contents = new Buffer(remarked(str, options));
  }
};
```
