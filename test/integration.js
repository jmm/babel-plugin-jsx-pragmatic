var
  assert = require("assert"),
  mocha = require("mocha"),
  _ = require("lodash"),
  babel = require("babel-core"),
  jsxPragmatic = require("../"),
  loadFixture = require("./helpers/load-fixture");

function doTransform (opts) {
  babel.transform(opts.code, {
    plugins: [[jsxPragmatic, opts.plugin]],
  });
}

describe("Plugin", function () {
  var
    requiredOpts = {
      module: "x",
      import: "x",
    };

  describe("Should require some options", function () {
    var
      code = '';

    Object.keys(requiredOpts).forEach(function (opt) {
      it("Should fail without `" + opt + "`", function () {
        var
          currentOpts = _.extend({}, requiredOpts);

        delete currentOpts[opt];

        assert.throws(function () {
          doTransform({code: code, plugin: currentOpts})
        });
      });
      // it
    });

    it("Should work with required opts", function () {
      assert.doesNotThrow(function () {
        doTransform({code: code, plugin: requiredOpts})
      });
    });
    // it
  });
  // describe

  it("Should not choke on JSX", function () {
    assert.doesNotThrow(function () {
      babel.transform(loadFixture("minimal.jsx"), {
        plugins: [[jsxPragmatic, requiredOpts]],
      });
    });
  });
});
