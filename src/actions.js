export const NS = "$$ROUTE_";

const PUSH_STATE = NS + "PUSH_STATE";
const REPLACE_STATE = NS + "REPLACE_STATE";
const POP_STATE = NS + "POP_STATE";

/**
 * Returns true if the given action is one of our actions.
 *
 * @param  {Object} action
 * @return {Boolean}
 */
export function isInternalAction ({ type }) {
  return (type.indexOf(NS) === 0);
}

/**
 * Trigger a push state in the router.
 */
export function pushState (path) {
  return { type: PUSH_STATE, path };
}

/**
 * Trigger a replace state in the router.
 */
export function replaceState (path) {
  return { type: REPLACE_STATE, path };
}

/**
 * Trigger a pop state in the router.
 */
export function popState () {
  return { type: POP_STATE, path };
}