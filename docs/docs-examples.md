
### Markdown

> Wouldn't it be awesome if you could just _use markdown however you wanted, wherever you needed it_?

Assemble gives you the flexibility to:

  * **Write entire documents in markdown**, and later compile them to HTML
  * **Keep sections of documents in externalized markdown files**, so they can be imported into other documents
  * **Embed or write "inline" markdown** on-the-fly inside HTML documents


_Read more about markdown features and `options` in the [markdown documentation][markdown]._


### "Include" extenal content
Use the markdown expression, `{{md}}`, to enable importing of external markdown content.

**Example #1: using full path**
``` handlebars
{{md ../path/to/content.md}}
```

**Example #2: using variables**
Or use a variable instead of setting the path directly inside the template. For example you can add the content variable to a YAML header:

``` yaml
---
page:
  title: Home
content: ../path/to/content.md
---
```
then use it like this:

``` handlebars
{{md content}}
```

#### Write "inline" markdown
The `{{#markdown}}{{/markdown}}` block expression allows markdown to be written "inline" with any HTML and handlebars content.

Example:

``` handlebars
{{#markdown}}
# Inline Markdown is awesome

> this is markdown content

  * useful for simple content
  * great for blog posts
  * easier on the eyes than angle brackets
  * even links look prettier

### Pretty links
[Visit Assemble](https://github.com/assemble/assemble)

### Even Prettier links
Embed handlebars templates to make them even prettier.
{{#page.links}}
[{{text}}]({{href}})
{{/page.links}}

{{/markdown}}
```


---

### Task defaults
Task targets, files and options may be specified according to the grunt [Configuring tasks](https://github.com/assemble/assemble/wiki/Task-and-Targets) guide.

#### Build templates

```javascript
assemble: {
  templates: {
    files: {
      'index.html': ['index.hbs']
    }
  }
}
```

#### Build multiple specified files individually

You can specify multiple `destination: [source]` items in `files`.

```javascript
assemble: {
  gh_pages: {
    files: {
      'docs': ['getting-started.hbs'],
      '.':    ['index.hbs']
    }
  }
}
```

#### Build directory of files

Grunt supports filename expansion (also know as globbing) via the built-in [node-glob][node-glob] and [minimatch][minimatch] libraries. So Templates may be used in filepaths or glob patterns.

```javascript
assemble: {
  project: {
    files: {
      '.': ['templates/*.hbs']
    }
  }
}
```

## Example Projects
Browse the [examples][assemble-examples] folder to get a better idea of what Assemble can do. To build the examples run `grunt examples`.


### Build Bootstrap's Grid with JSON or YAML
This example shows how to use JSON and handlebars templates to manipulate Bootstrap's grid system. We only have to define the grid one time using templates, then we can updated the grid columns, rows, and even content from a JSON or YAML file.


**Screenshot**
The finished result of the example project looks like this:

[![grid](https://github.com/assemble/assemble/blob/master/examples/advanced/dest/assets/grid.png?raw=true)][exampleGrid]

---

This is what our handlebars grid looks like. **_No really, this is the code for the entire grid!_**:

``` html
{{#grid.container}}
  <div class="container">
  {{#rows}}
    <div class="row">
      {{#columns}}
        <div class="span{{width}}"> {{md content}} </div>
      {{/columns}}
    </div>
  {{/rows}}
  </div>
{{/grid.container}}
```

And then we use an external data file, either `grid.yml` or `grid.json`, to configure the grid and provide the content.

**YAML version**
This is the data for our grid, written in YAML (`grid.yml`):

``` yaml
---
container:
  rows:
  - columns:
    - width: 4
      heading: Overview
      content: <%= content %>/overview.md
    - width: 4
      heading: Getting Started
      content: <%= content %>/getting-started.md
    - width: 4
      heading: Basics
      content: <%= content %>/basics.md
  - columns:
    - width: 6
      heading: Templates
      content: <%= content %>/templates.md
    - width: 6
      heading: Advanced
      content: <%= content %>/advanced.md
...
```

**JSON version**

And the same configuration writtin in JSON (`grid.json`) instead:

``` json
{
  "container": {
    "rows": [
      {
        "columns": [
          {
            "width": 4,
            "heading": "Overview",
            "content": "<%= content %>/overview.md"
          },
          {
            "width": 4,
            "heading": "Getting Started",
            "content": "<%= content %>/getting-started.md"
          },
          {
            "width": 4,
            "heading": "Basics",
            "content": "<%= content %>/basics.md"
          }
        ]
      },
      {
        "columns": [
          {
            "width": 6,
            "heading": "Templates",
            "content": "<%= content %>/templates.md"
          },
          {
            "width": 6,
            "heading": "Advanced",
            "content": "<%= content %>/advanced.md"
          }
        ]
      }
    ]
  }
}
```

If you're satisfied with the default `src` and `dest` paths in the `assemble`, simply run `grunt assemble` to compile the grid to static HTML. Or run `grunt watch` to continuously watch files and automatically re-build when changes occur.
