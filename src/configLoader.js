const fs = require("fs");

const defOptions = {
  adapter: "json",
  name: "database",
  path: "oriodb",
  deleteEmptyArray: true,
  deleteEmptyObject: true,
};

let output;

try {
  output = JSON.parse(
    fs.readFileSync(`${process.cwd()}/oriodb.config.json`, "UTF-8")
  );
} catch (e) {
  output = defOptions;

  fs.writeFileSync(
    `${process.cwd()}/oriodb.config.json`,
    JSON.stringify(defOptions),
    "UTF-8"
  );
}

if (!["json", "bson", "yaml"].includes(output.adapter)) {
  throw new Error("You must specify a valid adapter! (json, yaml or bson)");
}

module.exports = output;
