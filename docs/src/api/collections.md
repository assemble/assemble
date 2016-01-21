---
title: Collections
category: api
collection: docs
description: > 
  Collections are first-class citizens in Assemble, with three different collection types to choose from. This document describes each collection type and provides the information you need to start using them.
---

## API methods

- [.create](#create)
- [.collection](#collection)
- [.list](#list)
- [.group](#group)

## View collections

**What is a "view collection"?**

A view collection has all of the features of a "generic" {{appname}} collection, along with special features and methods that are specific to managing views (templates). 

**Special features**

View collections have methods getting, setting and finding views, as well as assigning "view types" to individual views (Learn more about [view types](./view-types.md)).

**Methods**

- [.setView](#setView)
- [.getView](#getView)
- [.viewType](#viewType)
- [.isType](#isType)

## Create

The `create` method is used for adding custom "view collections" to {{appname}}. A few things happen when the method is used:


- This exposed `page` and `pages` methods on {{appname}} ({{appname}} automatically detects inflections - plural and singular forms)
- A `pages`


## Collections types

Assemble 0.6.0 supports **3 different collection types**:

| **Collection type** | **unit** | **storage object** | **description** |
| --- | --- | --- | ---|
| **collections** | `item` | `items` | generic collections, with methods for setting and getting `items` |
| **view collections** | `view` | `views` | Methods for working with template collections, like pages, posts, layouts, partials, etc. |
| **lists** | `item` | `items` | Stored as an array, has methods for getting, setting, [sorting](https://github.com/jonschlinkert/templates/blob/master/lib/list.js#L359), [grouping](https://github.com/jonschlinkert/templates/blob/master/lib/list.js#L333). etc |

_(sidenote: views and items are also [vinyl](https://github.com/gulpjs/vinyl) files)_

Since "generic" collections are mostly used internally, from here forward "collection" will usually refer to "view collection" unless noted otherwise.

## View collections

View collections have methods for adding, finding and getting views, such as:

- `.getView`
- `.setView`

Views (templates) are stored on the `views` object of a collection, allowing views to be looked up by key. 

Keys can be customized and renamed using a [renameKey](/api/options#renameKey) function passed on the options of the collection, or to rename all keys in all collections, you may pass a `renameKey` function on the {{appname}} options. 

Ultimately this gives you full control over how views are named and how lookups are done.

## Lists

Lists are similar to collections but instead of storing an object of views, `items` are stored as an array. 


**Nice to know**

- You can create [lists from collections][lists-from-collections]
- You can create [collections from lists][collections-from-lists] 
- Lists are useful for doing things like:
  * [pagination][], 
  * [sorting](https://github.com/jonschlinkert/templates/blob/master/lib/list.js#L359), and
  * [grouping](https://github.com/jonschlinkert/templates/blob/master/lib/list.js#L333)

_(the above links go to [templates](https://github.com/jonschlinkert/templates), which is the underlying library that provides {{appname}} with methods for managing views, collections, rendering, engines, and so on. This lib could be used to create your own static site generator if you need something different)_

Last, keep in mind that {{appname}} is highly pluggable, so you can extend it to do whatever you need (plugins can be used on {{appname}} itself, a collection, or even a specific view). Let us know if you want to do something that you think ought to be in {{appname}} itself and we can discuss ways to implement it.

[lists-from-collections]: https://github.com/jonschlinkert/templates/blob/master/lib/list.js#L77-L83
[collections-from-lists]: https://github.com/jonschlinkert/templates/blob/master/lib/views.js#L75-L81
[pagination]: https://github.com/jonschlinkert/templates/blob/master/lib/list.js#L393
