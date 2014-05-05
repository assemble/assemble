# example assemble middleware
module.exports = (assemble) ->
  "use strict"

  middleware = (params, next) ->
    console.log("JavaScript Example Middleware", params.event)

    # do stuff
    next()
    return

  # Can be a single `event`, or an `events` array
  middleware.event = "page:after:render"
  "assemble-middleware-example": middleware