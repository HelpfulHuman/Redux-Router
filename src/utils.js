import { assertType } from "@helpfulhuman/route-kit";

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
 * Throws an error if object shape is not that of a history object.
 *
 * @param  {Object} history
 */
export function assertHistoryType (history) {
  assertType("history", "object", history);
  assertType("history.listen", "function", history.listen);
  assertType("history.pushState", "function", history.pushState);
  assertType("history.replaceState", "function", history.replaceState);
  assertType("history.popState", "function", history.popState);
}