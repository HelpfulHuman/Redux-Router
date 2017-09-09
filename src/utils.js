import { assertType, createContext } from "@helpfulhuman/router-kit";

/**
 * Default error handler for dealing with unhandled errors.
 *
 * @param {Error} err
 * @param {Object} ctx
 */
export function defaultErrorHandler (err, ctx) {
  console.error(`Route Error: ${ctx.uri} resulted in "${err.message}"`, err);
}

/**
 * Flatten a multidimensional array down to a single, flat array.
 */
export function flatten (arr) {
  var out = [];
  var _each = function (item) {
    if (Array.isArray(item)) {
      item.forEach(_each);
    } else {
      out.push(item);
    }
  }
  _each(arr);
  return out;
}

/**
 * Create a custom context object.
 *
 * @param  {Object} location
 * @param  {Function} getState
 * @param  {Function} dispatch
 * @return {Object}
 */
export function createReduxContext (location, getState, dispatch) {
  var ctx = createContext(location);
  return Object.assign(ctx, { getState, dispatch, state: getState() });
}

/**
 * Throws an error if object shape is not that of a history object.
 *
 * @param  {Object} history
 */
export function assertHistoryType (history) {
  assertType("history", "object", history);
  assertType("history.listen", "function", history.listen);
  assertType("history.push", "function", history.push);
  assertType("history.replace", "function", history.replace);
  assertType("history.goBack", "function", history.goBack);
}