import { parseParams, parseQuery } from "./utils";

class Context {

  /**
   * Create a new route context using a location object and any
   * state that the user would like to pass along.
   *
   * @param  {Object} location
   * @param  {Object} state
   */
  constructor (location, store) {
    this.location = location;
    this.state = state;
    this.query = parseQuery(location.search);
    this.params = {};
  }

  /**
   * Attempt to the match a given path pattern and assign the parameters
   * from the path token(s) to the current context object.  Returns true
   * if the path could be matched and parameters could be derived (if any).
   *
   * @param  {String} path
   * @return {Boolean}
   */
  matchesPath (path) {
    var params = parseParams(path, this.location.pathname);
    if ( ! params) return false;
    Object.assign(this.params, params);
    return true;
  }

}

export default Context;