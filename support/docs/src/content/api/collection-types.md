---
title: Collection Types
category: api
collection: docs
description: > 
  Collections are first-class citizens in Assemble, with three different collection types to choose from. This document describes each collection type and provides the information you need to start using them.
---

Assemble has first-class support for collections, with four different collection types to choose from, depending on your needs.

## Collection type comparison

**Collection type** | **Object (cache) type** | **Description**
--- | --- | ---
Collection | Object | Bare-bones collections, for caching an object of `items`. Use `app.collection()` or `new app.Collection()` when you want to customize your own render cycle, middleware handlers, or creating an entirely custom collection experience.
View collection | Object | Augments collections with special methods and middleware handlers that are synchronized to the render cycle. View collections are typically created using the [.create](#create) method.
List | Array | Similar to collections, but caches `items` as an **array**. Use `app.list()` or `new app.List()` to create a list.
Group | Object | Used within lists for grouping items. Can be used in conjunction with sorting, paging, pagination, and more.
