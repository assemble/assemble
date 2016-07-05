---
title: Classes
description: >
  The core classes exposed on Assemble's API
category: docs
sortBy: 40
---

## Classes

- [App](#App)
- [Collection](#Collection)
- [Group](#Group)
- [Item](#Item)
- [List](#List)
- [View](#View)
- [Views](#Views)
- [Router](#Router)
- [Route](#Route)

**Exposed as static properties**

All classes are exposed as static properties on both the `assemble` constructor, and the assemble instance (`app`). Thus, they can all be accessed as follows:

```js
var assemble = require('assemble');
var Collection = assemble.Collection;
var Group = assemble.Group;
var Item = assemble.Item;
var List = assemble.List;
var View = assemble.View;
var Views = assemble.Views;

// or
var app = assemble();
var Collection = app.Collection;
var Group = app.Group;
var Item = app.Item;
var List = app.List;
var View = app.View;
var Views = app.Views;
```

### App

Create an instance of `assemble` with the given `options`.

**Example**

```js
var assemble = require('assemble');
var app = assemble();
```

Sugar for:

```js
var Assemble = require('assemble');
var app = new Assemble();
```

### Collection

Create an instance of `Collection` with the given `options`.

**Example**

```js
var Collection = app.Collection;
var collection = new Collection();
```

Learn more about [Collect](api/Collect.md).

### Group

Create an instance of `Group` with the given `options`.

**Example**

```js
var Group = app.Group;
var group = new Group();
```

Learn more about [Group](api/Group.md).

### Item

Create an instance of `Item` with the given `options`.

**Example**

```js
var Item = app.Item;
var item = new Item();
```

Learn more about [Item](api/Item.md).

### List

Create an instance of `List` with the given `options`.

**Example**

```js
var List = app.List;
var list = new List();
```

Learn more about [List](api/List.md).

### Views

Create an instance of `Views` with the given `options`.

**Example**

```js
var Views = app.Views;
var views = new Views();
```

Learn more about [Views](api/Views.md).

### View

Create an instance of `View` with the given `options`.

**Example**

```js
var View = app.View;
var view = new View();
```

Learn more about [View](api/View.md).

### Router

Create an instance of `Router` with the given `options`.

**Example**

```js
var Router = app.Router;
var router = new Router();
```

Learn more about [Router](api/Router.md).

### Route

Create an instance of `Route` with the given `options`.

**Example**

```js
var Route = app.Route;
var route = new Route();
```

Learn more about [Route](api/Route.md).

