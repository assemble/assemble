
Let's start by creating a template, which can be any kind of markdown, text, xml or markup/HTML that we want to use. For this example our template is going to be HTML, and since I'm feeling creative let's call it `my-template.hbs`. 

Now, focusing only on the `head` of our HTML document, let's add template variables for `title` and `author` so that we can later replace them with real data:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>{{title}}</title>
    <meta name="author" content="{{author}}">
  </head>
  <body>
  </body>
</html>
```

Handlebars.js is the default template engine in Assemble, so our variables are wrapped in "Handlebars expressions": `{{` and `}}`. 

### Data

For data we can mix and match any of the following formats: 

* [JSON]() files, such as `my-data.json`
* [YAML]() files, such as `my-data.yml`
* [YAML Front-Matter](), embedded directly inside the template itself

When working with "external" data files, if we name our file the same as our template, and we add the path to the data file to the `options.data` object in the `assemble` task, then Assemble will pick it up and use it automatically.  

#### JSON example

Here is an example of what we might put inside of `my-template.json` to populate our template with data.

```json
{
  "title": "Assemble",
  "author": "Brian Woodward"
}
```
#### YAML example

Here is the same in YAML format: `my-template.yml`
``` yaml
title: Assemble
author: Brian Woodward
```

And this template: 

`my-template.hbs`
```
<h1>{{ title }}</h1>
```

#### YAML front-matter example

Or, in cases where we only require simple metadata we can use YAML Front-matter to eliminate the need for an external data file:

``` yaml
---
title: Assemble
author: Brian Woodward
---

<h1>{{ title }}</h1>
```

Outputs:

```html
<h1>Assemble</h1>
<p>Brian Woodward</p>
```

#### Underscore and yaml front-matter

Furthermore, we can optionally use underscore templates in the YAML front-matter to translate external variables into data inside the content:

``` yaml
---
title: <%= some.title.variable %>
author: <%= some.author.variable %>
---

<h1>{{ title }}</h1>
<p>{{ author }}</p>
```


