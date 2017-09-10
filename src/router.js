import flatten from "arr-flatten";
import pathToRegex from "path-to-regexp";
import { defaultErrorHandler } from "./utils";
import createReduxMiddleware from "./middleware";
import { compose, onPathMatch, assertType } from "@helpfulhuman/router-kit";

export default class Router {

  /**
   * Set up our router instance that will act as a factory for creating
   * and managing routing middleware.
   */
  constructor () {
    this.middleware   = [];
    this.aliases      = {};
    this.errorHandler = defaultErrorHandler;
  }

  /**
   * Creates an alias for a specific path.
   *
   * @param  {String} name
   * @param  {String} path
   * @return {Router}
   */
  alias (name, path) {
    this.aliases[name] = pathToRegex.compile(path);
    return this;
  }

  /**
   * Add a new middleware or "partial" handler to the router.
   *
   * @param  {String|Function} path
   * @param  {Function[]} ...middlewares
   * @return {Router}
   */
  use (path, ...middlewares) {
    if (typeof path === "function") {
      this.middleware = flatten([this.middleware, path, middlewares]);
    } else {
      this.middleware.push(onPathMatch(path, compose(middlewares), false));
    }
    return this;
  }

  /**
   * Add a new "exact match" handler to the router.
   *
   * @param  {String} path
   * @param  {Function[]} ...middlewares
   * @return {Router}
   */
  exact (path, ...middlewares) {
    if (middlewares.length === 0) {
      throw new Error("Bad argument: At least one middleware must be given to router.exact()");
    }
    this.middleware.push(onPathMatch(path, compose(middlewares), true));
    return this;
  }

  /**
   * Tie an action creator directly to a router to be dispatched immediately.
   *
   * @param  {String} path
   * @param  {Function[]} ...middleware
   * @param  {Function} action
   * @return {Router}
   */
  dispatch (path, ...middleware, action) {
    return this.exact(path, middleware.concat(function (ctx, next) {
      ctx.dispatch(typeof action === "function" ? action(ctx) : action);
      next();
    }));
  }

  /**
   * Replace the default error handler with a custom one.
   *
   * @param  {Function} handler
   * @return {Router}
   */
  catch (handler) {
    assertType("handler", "function", handler);
    this.errorHandler = handler;
    return this;
  }

  /**
   * Create and return a new Redux middleware for the router.
   *
   * @param {History} history
   */
  connectStore (history) {
    return createReduxMiddleware(
      this.middleware,
      this.errorHandler,
      this.aliases,
      history
    );
  }

}