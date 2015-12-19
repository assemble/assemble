# Plugins

## Plugin conventions

Assemble plugins follow the same guidelines and conventions as [gulp plugins]. 

> As a rule of thumb, whenever possible plugins should be created as gulp plugins, and Assemble-specific features in plugins should be kept to an absolute minimum.

We know there are times when this isn't possible or practical. For example, if the plugin needs relies on assemble-specific features or context that wouldn't be available without assemble (pagination comes to mind), then create the plugin as an "assemble" plugin using the same naming conventions as gulp plugins, but `assemble-foo` instead of `gulp-foo`.

## Authoring plugins

Please see the [gulp documentation] for information about authoring plugins. You'll find everything you need to know.

[gulp documentation]: https://github.com/gulpjs/gulp/tree/master/docs
[gulp plugins]: https://github.com/gulpjs/gulp/tree/master/docs/writing-a-plugin
