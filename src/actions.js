const NS            = "__ROUTER__";
const PUSH_STATE    = (NS + "PUSH_STATE");
const REPLACE_STATE = (NS + "REPLACE_STATE");
const POP_STATE     = (NS + "POP_STATE");

/**
 * Invokes the method on the given history object that matches the
 * action type.
 *
 * @param  {ReduxRouter} router
 * @param  {Object} action
 * @param  {History} history
 */
export function invokeRouteChange (router, { path, params }, history) {
  switch (action.type) {
    case PUSH_STATE:
      history.push(router.buildUri(path, params), {});
      break;
    case REPLACE_STATE:
      history.replace(router.buildUri(path, params), {});
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