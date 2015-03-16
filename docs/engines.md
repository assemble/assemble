# Engines

> Learn how to register your template engine of choice and use it to render templates with Assemble.


## Overview

- Engines, and their methods, are stored as objects on the `assemble._.engines` object.
- Engines are registered with the `assemble.engine()` method.
- Assemble has support for [consolidate.js], [engines], and [transformers]
- 

## Register an engine

```js
assemble.engine('hbs', require('engine-handlebars'));
```

### consolidate.js

[consolidate.js] normalizes the APIs for the most common node.js template engines. Here is how to register an engine using consolidate:

**Install with npm**

```bash
npm i assemble consolidate swig
```

**Register an engine with Assemble**

```js
var consolidate = require('consolidate');
assemble.engine('html', consolidate.swig);
```

### engines.js

[engines.js] provides syncronous engine support following the same conventions as [consolidate.js]. Here is how to register an engine using engines.js:

**Install with npm**

```bash
npm i assemble engines lodash
```

**Register an engine with Assemble**

```js
var engines = require('engines');
assemble.engine('hbs', engines.handlebars);
```


### transformers

[transformers] "gathers the most useful transformations you can apply to text or data into one library with a consistent API". Here is how to register an engine using transformers:

**Install with npm**

```bash
npm i assemble engines lodash
```

**Register an engine with Assemble**

```js
var engines = require('engines');
assemble.engine('hbs', engines.handlebars);
```



## Engine differences

Support for partials varies from one template engine to another. Assemble uses the same conventions as [consolidate.js] to provides a consistent, normalized interface to these engines.


Assemble allows you to use any template engine you want for rendering templates. 

## Table of contents

<!-- toc -->




[transformers]: https://github.com/ForbesLindesay/transformers
