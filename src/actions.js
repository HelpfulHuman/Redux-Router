export const NS = "__ROUTER__";

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
 * Invokes the method on the given history object that matches the
 * action type.
 *
 * @param  {Object} action
 * @param  {History} History
 */
export function invokeMatchingMethod (action, history) {
  switch (action.type) {
    case PUSH_STATE:
      history.pushState(action.path, {});
      break;
    case REPLACE_STATE:
      history.replaceState(action.path, {});
      break;
    case POP_STATE:
      history.popState(action.path, {});
      break;
  }
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