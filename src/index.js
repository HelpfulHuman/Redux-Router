import ReduxRouter from "./router";
import createReduxMiddleware from "./middleware";
import { pushState, replaceState, popState } from "./actions";

/**
 * Creates and returns a new router instance for adding routes and middleware
 * that can be added to a Redux store as middleware.
 */
export function createRouter () {
  return new ReduxRouter();
}

export {
  ReduxRouter,
  createReduxMiddleware,
  pushState,
  replaceState,
  popState,
  pushState as routeTo,
  replaceState as redirectTo,
  popState as goBack,
}