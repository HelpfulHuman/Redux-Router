import { noop } from "./utils";
import { isInternalAction, invokeMatchingMethod } from "./actions";
import Context from "./context";
import createHistory from "history/createBrowserHistory";

/**
 * Returns a new middleware function for Redux using the given
 * parameters.
 *
 * @param  {Router} router
 * @param  {Object} history
 * @return {Function}
 */
export default function connectRouter (router, history) {
  // no history given? create one instead
  if ( ! history) history = createHistory();

  // return the middleware function for redux
  return function ({ getState, dispatch }) {
    const processLocation = function (location) {
      var ctx = new Context(location, getState());
      router.process(ctx, dispatch);
    }

    history.listen(proccessLocation);

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