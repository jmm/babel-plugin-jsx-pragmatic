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
          jsxPragmatic().visitor.Program.enter(null, {
            opts: currentOpts,
          });
        });
      });
      // it
    });

    it("Should work with required opts", function () {
        assert.doesNotThrow(function () {
          jsxPragmatic({}).visitor.Program.enter(null, {
            opts: requiredOpts,
          });
        });
    });
    // it
  });
  // describe
});
// describe
