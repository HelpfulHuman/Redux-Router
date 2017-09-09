import createHistory from "history/createBrowserHistory";
import { assertHistoryType, createReduxContext } from "./utils";
import { invokeRouteChange, replaceState } from "./actions";
import { compose } from "@helpfulhuman/router-kit";

/**
 * Returns a new middleware function for Redux using the given parameters.
 *
 * @param  {Function[]} router
 * @param  {Function} errorHandler
 * @param  {Object} aliases
 * @param  {History} history
 * @return {Function}
 */
export default function createReduxMiddleware (middleware, errorHandler, aliases, history) {
  // no history given? create one instead
  if ( ! history) history = createHistory();
  // make sure we have a valid history object
  assertHistoryType(history);
  // cache a composed middleware function
  const runMiddleware = compose(middleware);
  // return the middleware function for redux
  return function ({ getState, dispatch }) {

    const processLocation = function (location) {
      var ctx = createReduxContext(location, getState, dispatch);
      runMiddleware(ctx, function (err, redirect) {
        if (err) {
          errorHandler(err);
        } else if (redirect) {
          dispatch(replaceState(redirect));
        }
      });
    }

    // subscribe to new route changes
    history.listen(processLocation);

    // process the current route location
    processLocation(window.location);

    return (next) => (action) => {
      invokeRouteChange(action, history);
      next(action);
    }
  }
}