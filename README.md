# Redux-Router

This library is a state-only router that is designed specifically for use with Redux.

## Getting Started

Install via `npm`:

```
npm install --save @helpfulhuman/redux-router
```

## Create Your Router

The `createRouter()` method is a factory for creating a new router instance that you can use to add your middleware.  You'll likely want to designate a file to your route configuration.

```js
import { createRouter } from "@helpfulhuman/redux-router";

// create a router instance
var router = createRouter();

// ...add routes here

// export the router to add it to your store
export default router;
```

## What is Middleware?

If you have experience working with [Connect](https://npmjs.com/package/connect) or [Express](https://npmjs.com/package/express), then the middleware system in this library should feel pretty familiar.  Middleware are functions that accept a `context` object (often shortened to `ctx`) that contains details about the current route and a callback function referred to as `next`.

Middleware is executed in the order that it is added to the router.  When a middleware finishes execution, it should invoke the given `next()` method to call the next middleware function in the stack.  If middleware has a problem and wants to quit execution of further middleware, then an `Error` should be passed as the first argument to `next()`.

In addition to handling errors, you can also invoke a redirect or a `replaceState()` by passing a URI as the second parameter to `next()`.

> **Note:** If you want to perform a redirect, make sure you pass `null` as the first argument to `next()`.

```js
function middlewareOne (ctx, next) {
  // when done, call `next()` to kick off middlewareTwo()
  next();
}

function middlewareTwo (ctx, next) {
  // did middlewareTwo have an error? tell `next()` about it
  next(new Error("something went wrong"));
}

function middlewareThree (ctx, next) {
  // perform a redirect by passing the desired URI as the second argument
  next(null, "/example");
}
```

### Context In-Depth

Field | Type | Description
------|------|------------
**getState** | `Function` | Your Redux store's `getState()` method (in case you need the absolute most recent state).
**dispatch** | `Function` | Your Redux store's `dispatch()` method.
**location** | `Object` | The `location` object provided by [history](https://npmjs.com/package/history) when routing is initialized.
**params** | `Object` | The parsed URI tokens for the route when a `path` with tokens has been provided for the middleware or route handler.  Example: if you had a handler bound to `/greet/:name` and the route was `/greet/world`, then this value would be `{ name: "world" }`.
**query** | `Object` | A parsed version of the query string for the route.  An example would be `?foo=bar` being converted to `{ foo: "bar" }`.
**state** | `Object` | The state of your Redux store when the route is first invoked.
**uri** | `String` | The URI or `location.pathname` for the request.

## Adding Routes and Middleware

The router instance returned by `createRouter()` currently supports a few different methods for adding middleware and route handlers.  These will be listed below.

### `.use(path: String?, ...middleware: Function[])`

For general middleware that should be invoked before proceeding (or via partial path matching), the `.use()` method works similarly to other frameworks, like [Connect](https://npmjs.com/package/connect).

```js
// add middleware that will be applied to all routes
router.use(function logger (ctx, next) {
  console.log("router -> " + ctx.location.href);
  next();
});

// add middleware that applies to a partial route name and redirects
// the user if the "token" value isn't set in their redux store
router.use("/account", function isLoggedIn (ctx, next) {
  if ( ! ctx.state.token) {
    next(null, "/login");
  } else {
    next();
  }
});
```

### `.exact(path: String, ...middleware: Function[])`

The `.exact()` method is similar to `.use()` with the exception that the `path` argument is required and the `path` pattern must match the current route in full.

```js
// add a handler that dispatches an action to redux
router.exact("/login", function (ctx, next) {
  ctx.dispatch({ type: "SET_VIEW", view: "login" });
});

// add a handler that dispatches actions based on route parameters
router.exact("/account/:page", function (ctx, next) {
  var page = ctx.params.page;
  if (page !== "profile" && page !== "billing") {
    return next(new Error("Page Not Found"));
  }

  ctx.dispatch({ type: "SET_VIEW", view: "account." + page });
});
```

### `.dispatch(path: String, action: Function)`

The `.dispatch()` is a shorthand method for binding an action creator directly to a route.  This follows the same rule as `.exact()` in that full path matching is required.  The next middleware in the stack is invoked immediately after dispatching the result, unless the action creator throws an error.

```js
// dispatches the returned results immediately when route matches
router.dispatch("/example", function (ctx) {
  return { type: "EXAMPLE_ROUTE_HIT" };
});

// this is the same as doing...
router.exact("/example", function (ctx, next) {
  ctx.dispatch({ type: "EXAMPLE_ROUTE_HIT" });
  next();
});
```

### `.catch(errorHandler: Function)`

You can supply a custom error handler using the `.catch()` method.

```js
router.catch(function (err, ctx) {
  ctx.dispatch({ type: "NOTIFY_ERROR", error: err });
  ctx.dispatch({ type: "SET_VIEW", view: "error" });
});
```

## Changing Route

Rather than invoking route changes on the router directly, this library does its best to plug in to the way that Redux handles state changes: via **action creators**.  There are 3 different action creators available for pushing, replacing and popping state.

> **Note:** Both `pushState()` and `replaceState()` support an object as an optional second argument.  This is to be used with [aliases](#using-aliases), which will be explained in more detail later on.

```js
import { pushState, replaceState, popState } from "@helpfulhuman/redux-router";

// push a new route onto the stack
pushState("/example");

// redirect to a new route by replacing the current route on the stack
replaceState("/something/else");

// go back to the previous route by popping the stack
popState();
```

## Using Aliases

Aliases allow you to work with a semantic route name as an abstraction over the actual route's URI.  By not littering URIs throughout your code, you can reduce the risk of forming bad URIs or reduce the hastle often associating with having to refactor URIs.

> **Note:** You can use tokens in the path that you're aliasing.

```js
// add a named alias for routing to a specific task
router.alias("viewTask", "/tasks/:taskId");

// route to the aliased URI -> /tasks/1000
pushState("viewTask", { taskId: "1000" });
```

## Connecting Your Router to redux

Once you've set up your routes, you can generate middleware for your Redux store with the `.connectStore()` method.  This method can optionally take a custom [history](https://npmjs.com/package/history) instance (if empty, one will be created for you) and returns the middleware for Redux.

```js
import createHistory from "history/createBrowserHistory";
import { createStore, applyMiddleware } from "redux";
import router from "./router";

// this is optional
var history = createHistory();

var store = createStore(reducer, applyMiddleware(
  router.connectStore(history)
));
```