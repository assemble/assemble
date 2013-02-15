# Content


## Markdown filter

Render markdown files by adding a reference to the file from a template. This is accomplished using a filter (in this case, a handlebars helper).

If you need to add content to a page, and you want to do so by "pulling in" the content from another (external) file, and you've chosen markdown to do the job - then you would use the `md` filter.

**Option #1: Basic Example**

Let's use a real-world example. Say you're creating an "About Us" page and you need to add some content, in particular the content from **about-us.md**.  First you simply add a template to the page where you want the content to render, in this example we'll add it directly inside the `<body></body>` tag. Inside the template itself, there are a couple of things you'll need to remember:

  1. **the "md" filter**: the first part of the tag must be the `md` filter
  2. **path and file name**: including the extension, `.md`, of the markdown file you want to use

``` html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>About Us</title>
  </head>
  <body>
    {{md ./docs/about-us.md}}
  </body>
</html>
```

**Option #2: Advanced Example**

In this example, we're going to change a couple of things about our approach.

  * We're going to make our template more durable and flexibly by removing the hard-coded reference to the path and name of the file we want to use. Instead, we'll make our template more descriptive of the location, and maybe what that location could potentially be used for, rather than pointing to a specific file that only has one use-case
  * And we're going to move the _decision concerning the path and file_ into our YAML front-matter. This means that we're using our configuration options to decide which content we want rendered in that location. We're using YAML front-matter here, but this could alternatively be moved into another configuration file. It really makes no difference.

Moving along, in this example we're doing _almost_ the same things as in the basic example, but we're going to change it up a bit:

  1. **the "md" filter**: the first part of the tag must be the `md` filter
  2. **template variable**: for the file you want to use. We're going to arbitrarily use the word "content" as our variable here
  3. **path and file name**: (including the extension), moved into the [[YAML front-matter|YAML-front-matter]]


``` html
---
content: ./docs/about-us.md
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>About Us</title>
  </head>
  <body>
    {{md content}}
  </body>
</html>
```

If you desire, you could move these setting into a config file:

```json
// config.json
{
  "name": "Big Project",
  "pages": {
    // bunch of pages

    "about-us": {
      "content": "./docs/about-us.md"
    }
  }
}
```
Then add a reference to `config.json` to the `assemble` task in your Gruntfile:

```js
assemble: {
  options: {
    data:   "path/to/config.json"
  },
  // other stuff
}
```

Learn more about:
  * [[Build configuration|gruntfile]]
  * Using [[templates]]
  * [[Default configuration settings|default-settings]]


