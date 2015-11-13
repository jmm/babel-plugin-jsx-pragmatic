var
  assert = require("assert"),
  mocha = require("mocha"),
  _ = require("lodash"),
  jsxPragmatic = require("../");

describe("Plugin", function () {
  var
    requiredOpts = {
      module: "x",
      import: "x",
    };

  it("Returns visitors", function () {
    assert(jsxPragmatic({}).visitor);
  });
  // it

  describe("Should require some options", function () {
    var
      code = '';

    Object.keys(requiredOpts).forEach(function (opt) {
      it("Should fail without `" + opt + "`", function () {
        var
          currentOpts = _.extend({}, requiredOpts);

        delete currentOpts[opt];

        assert.throws(function () {
          // TODO see if there's a better way to test this.
          jsxPragmatic({}).pre.call({
            opts: currentOpts,
          });
        });
      });
      // it
    });

    it("Should work with required opts", function () {
        assert.doesNotThrow(function () {
          jsxPragmatic({}).pre.call({
            opts: requiredOpts,
          });
        });
    });
    // it
  });
  // describe
});
// describe
