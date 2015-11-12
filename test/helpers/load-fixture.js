var
  fs = require("fs"),
  path = require("path");
  
module.exports = function loadFixture (id) {
  return fs.readFileSync(path.join(__dirname, "..", "fixtures", id), {
    encoding: "utf8",
  });
}
