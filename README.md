# Redux-Router

This library is a state-only router that is designed specifically for use with Redux.

## Getting Started

Install via `npm`:

```
npm install --save @helpfulhuman/redux-router
```

## Create Your Router

The `createRouter()` method is a factory for creating a new router instance that you can use to add your middleware.

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

// add a named alias for routing to /login
router.alias("login", "/login");

// add a handler that dispatches actions based on route parameters
router.exact("/account/:page", function (ctx, next) {
  var page = ctx.params.page;
  if (page !== "profile" && page !== "billing") {
    return next(new Error("Page Not Found"));
  }

  ctx.dispatch({ type: "SET_VIEW", view: "account." + page });
});

// catch and handle errors
router.catch(function (err, ctx) {
  ctx.dispatch({ type: "NOTIFY_ERROR", error: err });
  ctx.dispatch({ type: "SET_VIEW", view: "error" });
});

export default router;
```

## Connecting Your Router to redux

```js
import createHistory from "history/createBrowserHistory";
import { createStore, applyMiddleware } from "redux";
import router from "./router";

var history = createHistory();

var store = createStore(reducer, applyMiddleware(
  router.middleware(history)
));
```

## The Context Object