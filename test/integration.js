var
  _ = require("lodash"),
  assert = require("assert"),
  babel = require("babel-core"),
  createElement = require("./helpers/create-element"),
  jsxPragmatic = require("../"),
  loadFixture = require("./helpers/load-fixture"),
  mocha = require("mocha"),
  path = require("path"),
  sinon = require("sinon"),
  vm = require("vm");

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

describe("Transformed module", function () {
  this.timeout(6000);

  it("Should call createElement() with simple `pragma`", function () {
    var
      code,
      pragma = "createElement",
      spy = sinon.spy(createElement, "createElement"),
      opts = {
        module: path.join(__dirname, "helpers", "create-element"),
        import: pragma.split(".")[0],
      };

    code = babel.transform(loadFixture("minimal.jsx"), {
      plugins: [
        [jsxPragmatic, opts],
        ["babel-plugin-transform-react-jsx", {
          pragma: pragma,
        }]
      ],

      presets: ["es2015"],
    }).code;

    vm.runInNewContext(code, {
      require: function (id) {
        if (id === opts.module) return createElement;
      },
    });

    assert(
      spy.callCount,
      "createElement() wasn't called"
    );

    // Would rather do spy.restore() but it's undocumented.
    createElement.createElement.restore();
  });
});
// describe
