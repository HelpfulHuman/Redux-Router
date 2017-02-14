import Router from "./router";
import * as Actions from "./actions";
import _connectRouter from "./middleware";

/**
 * Factory method for generating a new router.
 *
 * @return {Router}
 */
export function createRouter () {
  return new Router;
}

/**
 * The factory function for creating router middleware for Redux.
 */
export const connectRouter = _connectRouter;

/**
 * Actions for changing the URL via dispatch calls.
 */
export const pushState = Actions.pushState;

export const replaceState = Actions.replaceState;

export const popState = Actions.popState;