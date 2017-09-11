# Redux-Router

This library is a state-only router that is designed specifically for use with Redux.  It is built on top of [Helpful Human's router-kit library](https://github.com/helpfulhuman/router-kit).

## Getting Started

Install via `npm`:

```
npm install --save @helpfulhuman/redux-router
```

## Create Your Router

The `createRouter()` method is a factory for creating a new `ReduxRouter` instance that you can use to add your middleware.  It should be noted that the `ReduxRouter` class extends [the `Router` class](https://github.com/helpfulhuman/router-kit#the-router-class) provided by `router-kit`.

> **Note:** You'll likely want to designate a file to your route configuration.

```js
import { createRouter } from "@helpfulhuman/redux-router";

// create a router instance
var router = createRouter();

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

// export the router to add it to your store
export default router;
```

### The `context` Object

Field | Type | Description
------|------|------------
**getState** | `Function` | Your Redux store's `getState()` method (in case you need the absolute most recent state).
**dispatch** | `Function` | Your Redux store's `dispatch()` method.
**location** | `Object` | The `location` object provided by [history](https://npmjs.com/package/history) when routing is initialized.
**params** | `Object` | The parsed URI tokens for the route when a `path` with tokens has been provided for the middleware or route handler.  Example: if you had a handler bound to `/greet/:name` and the route was `/greet/world`, then this value would be `{ name: "world" }`.
**query** | `Object` | A parsed version of the query string for the route.  An example would be `?foo=bar` being converted to `{ foo: "bar" }`.
**state** | `Object` | The state of your Redux store when the route is first invoked.
**uri** | `String` | The URI or `location.pathname` for the request.

## Changing Route

Rather than invoking route changes on the router directly, this library does its best to plug in to the way that Redux handles state changes: via **action creators**.  There are 3 different action creators available for pushing, replacing and popping state.

> **Note:** Both `pushState()` and `replaceState()` support an object as an optional second argument.  This is to be used with [aliases](#using-aliases), which will be explained in more detail later on.

```js
import { pushState, replaceState, popState } from "@helpfulhuman/redux-router";

// push a new route onto the stack
store.dispatch(pushState("/example"));

// redirect to a new route by replacing the current route on the stack
store.dispatch(replaceState("/something/else"));

// go back to the previous route by popping the stack
store.dispatch(popState());
```

### Using Aliases

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