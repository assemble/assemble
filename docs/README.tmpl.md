# {%= name %} [![NPM version](https://badge.fury.io/js/{%= name %}.png)](http://badge.fury.io/js/{%= name %}) {% if (travis) { %} [![Build Status]({%= travis %}.png)]({%= travis %}){% } %}

> {%= description %}

### [See the live docs →](http://assemble.io)

## Getting Started
{%= _.doc("getting-started.md") %}

## Options
{%= _.doc("options.md") %}

## Usage Examples
{%= _.doc("examples.md") %}

## Contributing
Please see the [Contributing to Assemble](http://assemble.io/contributing) guide for information on contributing to this project.

## Author

+ [{%= authors[0].name %}]({%= authors[0].url %})
+ [{%= authors[1].name %}]({%= authors[1].url %})

## Release History
{%= _.include("docs-changelog.md") %}

## License
Copyright (c) {%= grunt.template.today('yyyy') %} Sellside Inc.
Released under the [MIT License](./LICENSE-MIT).

***

_This file was generated on {%= grunt.template.today() %}._
