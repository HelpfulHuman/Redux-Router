import pathToRegex from "path-to-regexp";

/**
 * No operation function.
 */
export function noop () {}

/**
 * Ensures that the given value matches the type specify, otherwise
 * an error will be thrown.  Optionally provide a name for the value
 * in question.
 *
 * @param  {Any} value
 * @param  {String} type
 * @param  {String} name
 */
export function isType (value, type, name) {
  if (typeof value !== type) {
    if ( ! name) name = "Value";
    throw new Error(`${name} expected to be a ${type}, got ${typeof value} instead.`);
  }
}

/**
 * Returns the values of an object.
 *
 * @param  {Object} obj
 * @return {Array}
 */
export function getValues (obj) {
  return Object.keys(obj).map(k => obj[k]);
}

/**
 * Wraps the given function in a timeout call (that clears itself) to
 * effectively convert the function into an async operation.
 *
 * @param  {Function} fn
 * @return {Function}
 */
export function makeAsync (fn) {
  return function () {
    var that = this;
    var args = arguments;
    var t = setTimeout(function () {
      clearTimeout(t);
      fn.apply(that, args);
    }, 0);
  };
}

/**
 * Simple async series function.  Works through the array and invokes the
 * given iterator function on each value one at a time.  Triggers the callback
 * when finished or when an error occurs.
 *
 * @param  {Array} list
 * @param  {Function} iterator
 * @param  {Function} callback
 */
export function asyncSeries (list, iterator, callback) {
  list = list.slice(0);
  iterator = makeAsync(iterator);
  var next = function (err) {
    var item = list.shift();
    if (err || ! item) return callback(err);
    iterator(item, next);
  };
  next();
}

/**
 * Returns a params object if the route is a match, otherwise,
 * returns null.
 *
 * @param  {Array} args
 * @return {Object}
 */
export function parseParams (path, uri) {
  var arg, key, keys = [], params = {};
  var args = pathToRegex(path, keys).exec(uri);
  if (args) {
    args = args.slice(1);
    for (var i = 0; i < args.length; i++) {
      key = keys[i].name;
      arg = args[i];
      params[key] = (arg ? decodeURIComponent(arg) : arg);
    }
    return params;
  }
  return false;
}

/**
 * Parses a query string into an object.
 *
 * @param  {String} query
 * @return {Object}
 */
export function parseQuery (query) {
  var output = {};
  if (query) {
    var pieces = (query[0] === '?' ? query.substr(1) : query).split('&');
    for (var i = 0; i < pieces.length; i++) {
      var kv = pieces[i].split('=');
      output[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || '');
    }
  }
  return output;
}