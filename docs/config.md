# Configuration


Assemble gives you a few options for configuration:

  * [[Gruntfile]]
  * External files
  * [[YAML Front-Matter|yaml-front-matter]]



## External Configuration Files

  * JSON
  * YAML

If you are familiar with a `package.json` file, then you're familiar with this concept. When we refer to "external config files", we're just saying "anything outside of your pages (html) or Gruntfile". If you wish, you can use a `package.json` as a configuration file in your project.

For anyone who isn't familiar, this example `package.json` is from the Bootstrap project:

```
{
  "name": "bootstrap",
  "description": "Sleek, intuitive, and powerful front-end framework for faster and easier web development.",
  "version": "3.0.0",
  "keywords": [
    "bootstrap",
    "css"
  ],
  "homepage": "http://twitter.github.com/bootstrap/",
  "author": "Twitter Inc.",
  "scripts": {
    "test": "make test"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/twitter/bootstrap.git"
  },
  "licenses": [
    {
      "type": "Apache-2.0",
      "url": "http://www.apache.org/licenses/LICENSE-2.0"
    }
  ],
  "devDependencies": {
    "uglify-js": "1.3.4",
    "jshint": "0.9.1",
    "recess": "1.1.6",
    "connect": "2.1.3",
    "hogan.js": "2.0.0"
  }
}
```

TBC...

TODO: Explain
  * how the data is used by the build system,
  * how variables are used with templates
  * how mock data can be used


## YAML Front-Matter

Let's create a blog post to talk about the advantages of YAML front-matter, let's call it `06-21-2013-yaml-is-great.mustache`, and we'll use a component from [Toolkit](toolkit) for our blog post template:

```html
---
post:
  title: YAML Front-Matter
  description: How using YAML Front-Matter will make your life easier.
  layout: layout-post.mustache
---
<h1>{{ page.title }}</h1>
<p>{{ page.description }}</p>
```

In our YAML front-matter, we reference the layout, `layout-post.mustache`. This is the layout that will be used by the blog post, here is what it might look like:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>{{ page.title }}</title>
  </head>
  <body>
    {{> body }}
  </body>
</html>
```

The `{{> body }}` template is where the content for the post will be rendered.



## Related information

  * Learn more about [[Supported file types|supported-languages]], including `.mustache`, `.md`, `.hbr`, `.html` and others.
  * Get components from [Toolkit](toolkit)





[toolkit]: https://github.com/sellside/toolkit "Visit Toolkit's Repo on GitHub"