---
title: Using collections in templates
support:
  engines: ['handlebars']
---

Assemble automatically creates a block helper for each collection. You can use this helper to loop over the items in a collection inside your templates

**Example**

For example, to loop over all of views in the `pages` collection, you would do the following:

```handlebars
{{#pages}}
<!-- log out items on the "pages" collection -->
{{log . }}
{{/pages}}
```

## Collection items

Inside the collection block (`pages`, in this case), all of the collection's views are exposed on the `items` array _(`items` is used inside the block to make it easier to create templates that work with any collection, instead of hard-coding variables to `pages` or `posts`, for example)_:

**Examples**

Regardless of the collection name, views are always expose as `items` inside the block:

```handlebars
{{#pages}}
<!-- here, "items" are views from the "pages" collection -->
{{log items}}
{{/pages}}

{{#foo}}
<!-- here, "items" are views from a custom "foo" collection -->
{{log items}}
{{/foo}}

{{#posts}}
<!-- here, "items" are views from a custom "posts" collection -->
{{log items}}
{{/posts}}
```

## Manipulating items

Using [handlebars subexpressions](http://handlebarsjs.com/expressions.html#subexpressions), we can sort, filter or otherwise modify the `items` array in any way imaginable before finally looping over the `items` with the `each` helper.

For example, using the `sortBy` helper from [handlebars-helpers][], we can:

- sort all of the pages by the `title` defined in yaml front-matter
- then output the filepath of each page (you can use other helpers to get the relative path for each file)

```handlebars
{{#pages}}
<ul>
{{#each (sortBy items "data.title") as |item|}}
  <li>{{item.path}}</li>
{{/each}}
</ul>
{{/pages}}
```

