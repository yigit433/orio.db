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

          if (key.length > 1 && options.deleteEmptyObject) {
            key = key.slice(0, key.length - 1);
            let end = false;
            let stat = false;

            do {
              let d = baseGet(key, document);
              if (JSON.stringify(d) === "{}") {
                end = true;
              } else {
                key = key.slice(0, key.length - 1);
              }

              if (
                typeof d === "object" &&
                !Array.isArray(d) &&
                1 >= Object.keys(d).length
              ) {
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
