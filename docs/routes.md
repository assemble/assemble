
## API
### [Router](https://jonschlinkert/en-route/blob/master/lib/index.js#L24)

* **{Object}**: options
* `returns` **{Router}**: which is an callable function

Initialize a new `Router` with the given `options`.

### [.param](https://jonschlinkert/en-route/blob/master/lib/index.js#L83)

Map the given param placeholder `name`(s) to the given callback.

* `name` **{String}**
* `fn` **{Function}**
* `returns` **{app}**: for chaining

Parameter mapping is used to provide pre-conditions to routes which use normalized placeholders. For example a `:user_id` parameter could automatically load a user's information from the database without any additional code,

The callback uses the same signature as middleware, the only difference being that the value of the placeholder is passed, in this case the _id_ of the user. Once the `next()` function is invoked, just like middleware it will continue on to execute the route, or subsequent parameter functions.

**Example**

```js
assemble.param('user_id', function(file, next, id) {
  User.find(id, function(err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('failed to load user'));
    }
    file.user = user;
    next();
  });
});
```

### [.use](https://jonschlinkert/en-route/blob/master/lib/index.js#L388)

Use the given middleware function, with optional path, defaulting to `/`.

* `fn` **{Function}**

The other difference is that _route_ path is stripped and not visible to the handler function. The main effect of this feature is that mounted handlers can operate without any code changes regardless of the `prefix` pathname.

**Example**

```js
assemble.use(function (file, next) {
  file.data.foo = 'bar';
  next();
});
```

### [.route](https://jonschlinkert/en-route/blob/master/lib/index.js#L447)

Create a new Route for the given path.

* `path`: **{String}**
* `returns`: **{Object}**

Each route contains a separate middleware stack.

See the Route api documentation for details on adding handlers
and middleware to routes.



### [.all](https://jonschlinkert/en-route/blob/master/lib/route.js#L114)

Add a handler for all methods to this route.

* **{function}**: handler
* `returns` **{Route}**: for chaining

Behaves just like middleware and can respond or call `next`
to continue processing.

You can use multiple `.all` call to add multiple handlers.

```js
function checkSomething(file, next) {
  next();
};

function validateUser(file, next) {
  next();
};

route
  .all(validateUser)
  .all(checkSomething)
  .get(function(file, next) {
    file.data.message = "Hello, World!";
  });
```
