const assert = require("chai").assert;
const sinon  = require("sinon");
const { Router } = require("../");

function noop () {}

describe("Router.use()", function () {

  var router;
  beforeEach(function () {
    router = new Router();
  });

  it("adds middleware without a path to the top level list of middleware", function () {
    router.use(noop, noop, [noop, noop], noop);
    assert.lengthOf(router.middleware, 5);
  });

  it("adds middleware with a path as a composed group of nested middleware");

});