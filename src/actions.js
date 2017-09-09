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
 * Returns the actual path in the event that a route alias is given and
 * not a URI.
 *
 * @param  {Object} aliases
 * @param  {Object} action
 * @return {String}
 */
export function getActualPath (aliases, { path, params }) {
  var alias = aliases[path];
  if (alias) {
    return alias(params);
  }
  return path;
}

/**
 * Invokes the method on the given history object that matches the
 * action type.
 *
 * @param  {Object} aliases
 * @param  {Object} action
 * @param  {History} History
 */
export function invokeMatchingMethod (aliases, action, history) {
  switch (action.type) {
    case PUSH_STATE:
      history.push(getActualPath(action), {});
      break;
    case REPLACE_STATE:
      history.replace(getActualPath(action), {});
      break;
    case POP_STATE:
      history.goBack();
      break;
  }
}

/**
 * Trigger a push state in the router.
 *
 * @param  {String} path
 * @param  {Object} params
 * @return {Object}
 */
export function pushState (path, params = {}) {
  return { type: PUSH_STATE, path, params };
}

/**
 * Trigger a replace state in the router.
 *
 * @param  {String} path
 * @param  {Object} params
 * @return {Object}
 */
export function replaceState (path, params = {}) {
  return { type: REPLACE_STATE, path, params };
}

/**
 * Trigger a pop state in the router.
 *
 * @return {Object}
 */
export function popState () {
  return { type: POP_STATE };
}