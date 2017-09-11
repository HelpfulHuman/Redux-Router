import createReduxMiddleware from "./middleware";
import { Router } from "@helpfulhuman/router-kit";

export default class ReduxRouter extends Router {

  /**
   * Tie an action creator directly to a router to be dispatched immediately.
   *
   * @param  {String} path
   * @param  {Function} action
   * @return {Router}
   */
  dispatch (path, action) {
    return this.exact(path, function (ctx, next) {
      ctx.dispatch(typeof action === "function" ? action(ctx) : action);
      next();
    });
  }

  /**
   * Replace the default error handler with a custom one.
   *
   * @param  {Function} handler
   * @return {Router}
   */
  catch (handler) {
    if (typeof handler !== "function") {
      throw new Error("Bad argument: Error handler must be a function!");
    }
    this.onerror = handler;
    return this;
  }

  /**
   * Create and return a new Redux middleware for the router.
   *
   * @param  {History} history
   * @return {Function}
   */
  connectStore (history) {
    return createReduxMiddleware(this, history);
  }

}