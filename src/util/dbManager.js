const { baseSet, baseGet, baseDelete, dataConverter } = require("./handlers");
const options = require("../configLoader");
const fs = require("fs");

module.exports = (adapter = "json") => {
  return {
    all(path, name) {
      let document;

      if (!fs.readdirSync(process.cwd()).includes(path.split("/")[0])) {
        fs.mkdirSync(path);
      }

      try {
        document = fs.readFileSync(
          `${process.cwd()}/${path}/${name + "." + adapter}`
        );
        document = dataConverter[adapter].parse(document);
        document = Object.entries(document).map((val) => ({
          ID: val[0],
          data: val[1],
        }));
      } catch (err) {
        document = [];
      }

      return document;
    },
    set(key, value, path, name) {
      let document;

      if (!fs.readdirSync(process.cwd()).includes(path.split("/")[0])) {
        fs.mkdirSync(path);
      }

      try {
        document = fs.readFileSync(
          `${process.cwd()}/${path}/${name + "." + adapter}`
        );
        document = dataConverter[adapter].parse(document);
        document = baseSet(key, value, document);

        fs.writeFileSync(
          `${process.cwd()}/${path}/${name + "." + adapter}`,
          dataConverter[adapter].stringify(document)
        );

        document = baseGet(key, document);
      } catch (err) {
        document = baseSet(key, value, {});

        fs.writeFileSync(
          `${process.cwd()}/${path}/${name + "." + adapter}`,
          dataConverter[adapter].stringify(document)
        );
      }

      return document;
    },
    delete(key, path, name) {
      let document;

      if (!fs.readdirSync(process.cwd()).includes(path.split("/")[0])) {
        fs.mkdirSync(path);
      }

      try {
        document = fs.readFileSync(
          `${process.cwd()}/${path}/${name + "." + adapter}`
        );
        document = dataConverter[adapter].parse(document);
        if (!baseGet(key, document)) {
          document = false;
        } else {
          document = baseDelete(key, document);

          if (key.length > 0 && options.deleteEmptyObject) {
            key = key.slice(0, key.length - 1);
            let stat = false;
            let end = false;

            do {
              result = baseGet(key, document);
              result = Object.entries(result).every((r, i) => {
                return (
                  (JSON.stringify(r[1]) == "{}" ||
                    (typeof r[1] === "object" && !Array.isArray(r[1]))) &&
                  i > 0
                );
              });

              if (
                result &&
                (Object.entries(result).length == 1 ||
                  Object.entries(result).length == 0)
              ) {
                key = key.slice(0, key.length - 1);
                stat = true;
              } else {
                end = true;
              }
            } while (!end);

            if (stat) {
              document = baseDelete(key, document);
            }
          }

          fs.writeFileSync(
            `${process.cwd()}/${path}/${name + "." + adapter}`,
            dataConverter[adapter].stringify(document)
          );

          document = true;
        }
      } catch (err) {
        console.log(err);
        document = false;
      }

      return document;
    },
  };
};
