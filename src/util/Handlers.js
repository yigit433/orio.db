const Bson = require("bson");
const Yaml = require("yaml");

module.exports = {
  baseSet(key, value, oldData) {
    let output = "oldData";
    let nData = {};

    if (typeof data === "object" && !Array.isArray(value)) {
      Object.entries(value).forEach((entry, index, arr) => {
        if (
          (typeof entry[1] === "object" && !Array.isArray(entry[1])) ||
          (!isNaN(entry[1]) && !entry[1]) ||
          !entry[1] ||
          entry[1].length === 0
        ) {
          nData[entry[0]] = entry[1];
        } else {
          return;
        }
      });
    } else nData = value;

    key.forEach((_key, i, arr) => {
      if (!eval(output).hasOwnProperty(_key)) {
        output += `["${_key}"]`;

        eval(`${output} = {}`);
      } else output += `["${_key}"]`;

      if (arr.length == i + 1) output += `= ${JSON.stringify(nData)}`;
    });

    eval(output);

    return oldData;
  },
  baseGet(key, data) {
    if (typeof data !== "object" || Array.isArray(data)) {
      return;
    }
    let output = false;

    key.forEach(_key => {
      if (data.hasOwnProperty(_key)) {
        data = data[_key];
        output = true;
      } else {
        output = false;
      }
    });

    return output ? data : undefined;
  },
  baseDelete(key, data) {
    let nData = "";

    key.forEach(_key => {
      if (nData.length === 0) nData += "delete data";

      nData += `["${_key}"]`;
    });

    eval(nData);

    return data;
  },
  arrFindByValue(arr, filt) {
    if (!arr || !Array.isArray(arr) || !filt || Array.isArray(filt)) {
      return;
    }
    filt =
      typeof filt === "object" && !Array.isArray(filt)
        ? Object.entries(filt)
        : filt;
    let output;

    if (Array.isArray(filt)) {
      output = arr.map((val, i) => {
        if (typeof val !== "object" || Array.isArray(val) || !val) return;

        return {
          target: val,
          matches: filt.map(_val => val[_val[0]] === _val[1]),
          index: i
        };
      });

      output = output.filter((val) => val !== undefined);
      output = (
        output.some(
          (val) => val.matches.filter(_val => _val).length === val.matches.length
        )
        ?
        output.filter(
          (val) => val.matches.filter(_val => _val).length === val.matches.length
        )
        : 
        output
      );
      output = arr.filter((val, i) => output.some(_val => _val.index != i));
    } else output = arr.filter((val) => val !== filt);

    return output;
  },
  valueChecker(value) {
    return ["string", "number", "boolean", "object"].includes(typeof value);
  },
  dataConverter: {
    json: {
      parse(data) {
        let output;

        try {
          output = JSON.parse(data);
        } catch (err) {
          output = undefined;
        }

        return output;
      },
      stringify(data) {
        let output;

        try {
          output = JSON.stringify(data);
        } catch (err) {
          output = undefined;
        }

        return output;
      }
    },
    yaml: {
      parse(data) {
        let output;

        try {
          output = Yaml.parse(data);
        } catch (err) {
          output = undefined;
        }

        return output;
      },
      stringify(data) {
        let output;

        try {
          output = Yaml.stringify(data);
        } catch (err) {
          output = undefined;
        }

        return output;
      }
    },
    bson: {
      parse(data) {
        let output;

        try {
          output = Bson.deserialize(data);
        } catch (err) {
          output = undefined;
        }

        return output;
      },
      stringify(data) {
        let output;

        try {
          output = Bson.serialize(data);
        } catch (err) {
          output = undefined;
        }

        return output;
      }
    }
  }
};
