import createHistory from "history/createBrowserHistory";
import { invokeRouteChange, replaceState } from "./actions";
import { connectHistory } from "@helpfulhuman/router-kit";

/**
 * Returns a new middleware function for Redux using the given parameters.
 *
 * @param  {ReduxRouter} router
 * @param  {History} history
 * @return {Function}
 */
export default function createReduxMiddleware (router, history) {
  // no history given? create one instead
  if ( ! history) history = createHistory();
  // return the middleware function for redux
  return function ({ getState, dispatch }) {

    // create a result handler for errors and redirects
    const handleResult = function (err, redirect) {
      if (err && typeof router.onerror === "function") {
        router.onerror(err);
      } else if (!err && redirect) {
        dispatch(replaceState(redirect));
      }
    }

    // connect our router to history with a custom handler
    connectHistory(router, history, function (context, run) {
      context = Object.assign(context, { state: getState, dispatch });
      run(context, handleResult);
    });

    return (next) => (action) => {
      invokeRouteChange(router, action, history);
      next(action);
    }
  }
}