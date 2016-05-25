**v0.12.0**

- Bumps [assemble-core][] to v0.18.0, which includes a bump in [templates][]. See the changelog on the templates library for more details.

**v0.11.0**

- `debug` methods and related code have been removed
- Bumps [assemble-core][] to v0.17.0

**v0.10.0**

- Adds support for using es6 generators with tasks
- Bumps [assemble-core][] to v0.15.0

**v0.9.0**

- Bumps several dependencies. No API changes, this is mostly an optimization release. Be sure to completely remove `node_modules` and reinstall all dependencies to avoid errors such as `isRegistered is not a function`

**v0.8.0**

- Updates [composer][] to v0.11.0, which removes the `.watch` method in favor of using the [base-watch][] plugin.
- Changes in [templates][]. Please see v0.11.0 in [templates history](https://github.com/jonschlinkert/templates#history) for more details.

**v0.7.0**

- Stability improvements and optimizations of the API introduced in v0.6.0.

**v0.6.0**

- Major refactor. Assemble was completely re-written from the ground-up as a standalone node.js library and is no longer a grunt plugin. Grunt plugin support has been moved to [grunt-assemble][]. Please see that repo for additional details.