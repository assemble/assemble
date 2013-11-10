# {%= name %} [![NPM version](https://badge.fury.io/js/{%= name %}.png)](http://badge.fury.io/js/{%= name %}) {% if (travis) { %} [![Build Status]({%= travis %}.png)]({%= travis %}){% } %}

> {%= description %}

### [Visit the website →](http://assemble.io)

## Why use Assemble? 

1. Most popular site generator for Grunt.js and Yeoman. Assemble is used to build hundreds of web projects, ranging in size from a single page to 14,000 pages (that we're aware of!). [Let us know if you use Assemble](https://github.com/assemble/assemble/issues/300). 
1. Allows you to carve your HTML up into reusable fragments: partials, includes, sections, snippets... Whatever you prefer to call them, Assemble does that. 
1. Optionally use `layouts` to wrap your pages with commonly used elements and content.
1. "Pages" can either be defined as HTML/templates, JSON or YAML, or directly inside the Grunfile.
1. It's awesome. Lol just kidding. But seriously, Assemble... is... awesome! and it's fun to use.

...and of course, we use Assemble to build the project's own documentation [http://assemble.io](http://assemble.io):

![image](https://f.cloud.github.com/assets/383994/1463257/f031bcfe-4525-11e3-9a03-89a17eee7518.png)


## Getting Started
{%= _.doc("getting-started.md") %}

## Options
{%= _.doc("options.md") %}

## Usage Examples
{%= _.doc("examples.md") %}

## Contributing
Please see the [Contributing to Assemble](http://assemble.io/contributing) guide for information on contributing to this project.

## Authors

**Jon Schlinkert**

+ [twitter.com/jonschlinkert](http://twitter.com/jonschlinkert)
+ [github.com/jonschlinkert](http://github.com/jonschlinkert)

**Brian Woodward**

+ [twitter.com/doowb](http://twitter.com/doowb)
+ [github.com/doowb](http://github.com/doowb)


## Release History
{%= _.include("docs-changelog.md") %}

## License
Copyright (c) {%= grunt.template.today('yyyy') %} Sellside Inc.
Released under the [MIT License](./LICENSE-MIT).

***

_This file was generated on {%= grunt.template.date("fullDate") %}._
