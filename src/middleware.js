import { noop } from "./utils";
import { isInternalAction } from "./actions";
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
    // TODO hook up the router to start listening
    // TODO hydrate state on load here
    history.listen(function (location) {
      var ctx = new Context(location, getState());
      router.process(ctx, dispatch);
    });

    return next => action => {
      // check if the action is one of ours and handle the history as needed
      if (isInternalAction(action)) {
        return;
      }

      // dispatch the action if it's not one of ours
      next(action);
    }
  }
}