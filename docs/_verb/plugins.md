# Plugin conventions

> Whenever possible, as a rule of thumb, plugins should be created as gulp plugins. 

We try to keep assemble-specific features in plugins to an absolute minimum. However, there are times when this isn't possible or practical. 

If the plugin must have assemble-specific features, like logic for pagination, then create the plugin as an "assemble" plugin using the same naming conventions as gulp plugins, but `assemble-foo` instead of `gulp-foo`.
