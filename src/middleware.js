import createHistory from "history/createBrowserHistory";
import { assertHistoryType, createReduxContext } from "./utils";
import { isInternalAction, invokeMatchingMethod, replaceState } from "./actions";

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
  // return the middleware function for redux
  return function ({ getState, dispatch }) {

    const processLocation = function (location) {
      var ctx = createReduxContext(location, getState(), dispatch);
      runMiddleware(router.middleware, function (err, redirect) {
        if (err) {
          router.errorHandler(err);
        } else if (redirect) {
          dispatch(replaceState(redirect));
        }
      });
    }

    history.listen(processLocation);

    processLocation(window.location);

    return next => action => {
      // check if the action is one of ours and handle the history as needed
      if (isInternalAction(action)) {
        invokeMatchingMethod(action, history);
      }
      next(action);
    }
  }
}