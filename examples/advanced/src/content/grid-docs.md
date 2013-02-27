# Update your Grid System using Data


**What you will learn**

  * We will create a grid component that _only needs to be defined one time_ using handlebars templates
  * Containers, columns, and rows can then be manipulated using only JSON or YAML (depending on your preference)
  * Content can be updated using JSON, YAML, markdown, plain text, or good old fashioned HTML
  * We're going to use classes and markup from Bootstrap to structure the grid


How the grid will be constructed:

  * structure: handlebars templates to create the grid structure
  * configuration: JSON (or YAML) for data to define the columns
  * content: Markdown, HTML, plain text, YAML or JSON for content


## Grid Ingredients

Since we're relying on Bootstrap for the grid classes and markup, here are the classes we might want to use in our grid, so that we can plan the best way to lay it out with handlebars templates:

  * `.container` or `.container-fluid` for the outter "wrapper"
  * `.row` or `.row-fluid` for our rows
  * `.span1` through `.span12` for our columns

For now, let's build a simplified version of the grid that excludes the fluid classes, afterwards we'll show how to change the grid to optionally include those classes. Which means for our simple grid we need templates for:

  * `.container`: this class can be "hard-coded"
  * `.row`: this class can be "hard-coded", but we need to have the ability to create as many rows as we need inside the container)
  * `.span1` through `.span12`: we need to have the ability to define the number of columns we need in each row

Our final markup will look something like this:

``` html
<div class="container">
  <div class="row">
    <div class="span3"> ... </div>
    <div class="span3"> ... </div>
    <div class="span3"> ... </div>
    <div class="span3"> ... </div>
  </div>
</div>
```


## Grid Configuration


#### context

In Assemble, context works differently for data versus templates:

  * `data`: context is established by either the file name, or by the
  * `templates` as being two sides of the same coin.




#### `.container`

The most difficult part of building the grid is understanding how _context_ works with templates and data, or more specifically how handlebars and JSON will work together in this example. Once we have our grid defined in handlebars templates, we will configure the grid using JSON and then populate it using content from external files. So it's important to know that Assemble uses the file name to establish context for data, can context is what allows the templates to access the data. This means we need to name our data file `grid.json` and then we will start our templates using `grid` context so that we can access the data in `grid.json`.   and since `.container` is our outtermost class our templates would look like this:


``` handlebars
{{#grid.container}}
  <div class="container">

   <!-- rows, columns and content -->

  </div>
{{/grid.container}}
```

and inside `grid.json`, our corresponding data would look like this:

``` json
{
  "container": {
    ...
  }
}
```


#### `.row`





### Container

file Starting with the container

``` handlebars
{{#grid.container}}
  <div class="container">

    {{#rows}}
      <div class="row">

        {{#spans}}
          <div class="span{{columns}}">



          </div>
        {{/spans}}

      </div>
    {{/rows}}

  </div>
{{/grid.container}}
```


