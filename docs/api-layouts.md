
**Example**

```js
// get all the layouts and pass them to assemble-layouts for use
var assembleLayouts = new require('assemble-layouts').Layouts();
var _ = require('lodash');

var layouts = assemble.layouts();
_(layouts).forEach(function (layout, name) {
  assembleLayouts.set(name, layout);
});
```