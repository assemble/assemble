# Data

> This document describes how data is handled in Assemble.


* Built-in variables
* Front matter
* Data files
* `options.data`
* Data API



## Data overview

Assemble gives you a number of ways to specify data



## Built-in variables


## Data files





#### data.json or data.yml

Unlike other data files, data from `data.json` or `data.yml` is merged directly onto the root `data` object.

**Example:**

Given you have `data.json` containing:

```json
{
  "gamma": "three"
}
```

This data can now be accessed in templates like this:

```handlebars
{{gamma}}
```

Resulting in `three`.



## Data API

Data methods available on the Assemble API.

{%= jscomments("lib/data.js") %}