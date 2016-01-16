---
title: Classes
description: >
  Brief overview of each of the core classes exposed on Assemble's API, with links to additional information.
---

## Overview

Aside from `Assemble` itelf, all classes are exposed as static properties on the the main export of the assemble module. Thus, they can all be accessed as follows:

```js
var assemble = require('assemble');
var Collection = assemble.Collection;
var Group = assemble.Group;
var Item = assemble.Item;
var List = assemble.List;
var View = assemble.View;
var Views = assemble.Views;
```

## API

* [Assemble](#Assemble)
* [Collection](#Collection)
* [Group](#Group)
* [Item](#Item)
* [List](#List)
* [View](#View)
* [Views](#Views)

### Assemble

**Example**

```js
var app = assemble();
```

Sugar for:

```js
var app = new Assemble();
```

### Collection

**Example**

```js
var collection = new Collection();
```

Learn [more about Collection](/api/Collection.md).

### Group

**Example**

```js
var group = new Group();
```

Learn [more about Group](/api/Group.md).

### Item

**Example**

```js
var item = new Item();
```

Learn [more about Item](/api/Item.md).

### List

**Example**

```js
var list = new List();
```

Learn [more about List](/api/List.md).

### View

**Example**

```js
var view = new View();
```

Learn [more about View](/api/View.md).

### Views

**Example**

```js
var views = new Views();
```

Learn [more about Views](/api/Views.md).
