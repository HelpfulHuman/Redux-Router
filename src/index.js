import Router from "./router";
import createReduxMiddleware from "./middleware";
import { pushState, replaceState, popState } from "./actions";

/**
 * Creates and returns a new router instance for adding routes and middleware
 * that can be added to a Redux store as middleware.
 */
export function createRouter () {
  return new Router();
}

export {
  Router,
  createReduxMiddleware,
  pushState,
  replaceState,
  popState,
  pushState as push,
  replaceState as redirect,
  popState as goBack,
}