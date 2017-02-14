import { isType, asyncSeries } from "./utils";
import { replaceState } from "./actions";

class Router {

  /**
   * Set up our router instance that will act as a factory for creating
   * and managing routing middleware.
   */
  constructor () {
    this.middleware = [];
    this.errorHandler = null;
  }

  /**
   * Handle errors on this router.  Catching errors for this route(r) means
   * that they will not bubble up to any parent router(s).
   *
   * @param  {Function} handler
   * @return {this}
   */
  catch (handler) {
    isType(handler, "function", "Handler");
    this.errorHandler = handler;
    return this;
  }

  /**
   * Adds a new middleware function to the stack.
   *
   * @param  {Function} middleware
   * @return {this}
   */
  use (middleware) {
    isType(middleware, "function", "Middleware");
    this.middleware.push(middleware);
    return this;
  }

  /**
   * Macro for automatically creating a new sub-router that only triggers if
   * the location passing through it matches the given path pattern.  Otherwise,
   * the sub router (and its middleware) will be skipped.
   *
   * @param  {String} path
   * @return {Router}
   */
  when (path) {
    isType(path, "string", "path");
    // create a new router instance that will be returned
    var router = new Router();
    // generate custom middleware for invoking this router if the
    // location's pathname matches the given path pattern
    this.use(function (ctx, dispatch, next) {
      if ( ! ctx.matchesPath(path)) next();
      else router.process(ctx, dispatch, function (err) {
        if (err) next(err);
      });
    });
    // return our new sub router
    return router;
  }

  /**
   * Macro for creating middleware that will replace the current location
   * state with the returned URI string.
   *
   * @param  {Function} predicate
   * @return {this}
   */
  redirect (predicate) {
    isType(predicate, "function", "predicate");
    return this.use(function (ctx, dispatch, next) {
      var url = predicate(ctx);
      if ( ! url) next();
      else dispatch(replaceState(url));
    });
  }

  /**
   * Macro for immediately invoking the dispatch with the result of the given
   * action creator.
   *
   * @param  {Function} action
   * @return {this}
   */
  dispatch (action) {
    isType(action, "function", "Action");
    return this.use(function (ctx, dispatch, next) {
      dispatch(action(ctx));
      next();
    });
  }

  /**
   * Pass the context object and dispatch function to each middleware, then
   * invoke the given callback when finished or when an error occurs if no
   * error handler has been set on this router.
   *
   * @param  {Context} ctx
   * @param  {Function} dispatch
   * @param  {Function} callback
   */
  process (ctx, dispatch, callback) {
    asyncSeries(
      this.middleware,
      (mw, next) => mw(ctx, dispatch, next),
      (err) => {
        if (err && this.errorHandler) {
          this.errorHandler(err);
        } else if (callback) {
          callback(err);
        }
      }
    );
  }

}

export default Router;