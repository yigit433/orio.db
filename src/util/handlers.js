const Bson = require("bson");
const Yaml = require("yaml");

const getMaxValue = (d) => {
  let maxnum = Infinity * -1;

  for (let ind = 0; d.length > ind; ind++) {
    let num = d[ind];

    if (num[0] >= (Array.isArray(maxnum) ? maxnum[0][0] : maxnum)) {
      if (ind === 0) maxnum = [];

      maxnum.push(num);
    }
  }

  return maxnum;
};

module.exports = {
  baseSet: (key, value, oldData) => {
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
  baseGet: (key, data) => {
    if (typeof data !== "object" || Array.isArray(data)) {
      return;
    }
    let output = false;

    key.forEach((_key) => {
      if (data.hasOwnProperty(_key)) {
        data = data[_key];
        output = true;
      } else {
        output = false;
      }
    });

    return output ? data : undefined;
  },
  baseDelete: (key, data) => {
    let nData = "";

    key.forEach((_key) => {
      if (nData.length === 0) nData += "delete data";

      nData += `["${_key}"]`;
    });

    eval(nData);

    return data;
  },
  valueChecker: (value) => {
    return ["string", "number", "boolean", "object"].includes(typeof value);
  },
  findNearestData: (query, data) => {
    const queryArr = Object.entries(query);
    const queryResult = data.map((d) => {
      const queryStat = queryArr.map((q) => d[q[0]] === q[1]);

      return {
        p: d,
        t: queryStat.filter((v) => v === true).length,
        f: queryStat.filter((v) => v === false).length,
      };
    });

    const arr = queryResult.map((el, ind) => [el.t, ind, el.p]);
    const max = getMaxValue(arr);

    return max;
  },
  dataConverter: {
    json: {
      parse: (data) => {
        let output;

        try {
          output = JSON.parse(data);
        } catch (err) {
          output = undefined;
        }

        return output;
      },
      stringify: (data) => {
        let output;

        try {
          output = JSON.stringify(data);
        } catch (err) {
          output = undefined;
        }

        return output;
      },
    },
    yaml: {
      parse: (data) => {
        let output;

        try {
          output = Yaml.parse(data);
        } catch (err) {
          output = undefined;
        }

        return output;
      },
      stringify: (data) => {
        let output;

        try {
          output = Yaml.stringify(data);
        } catch (err) {
          output = undefined;
        }

        return output;
      },
    },
    bson: {
      parse: (data) => {
        let output;

        try {
          output = Bson.deserialize(data);
        } catch (err) {
          output = undefined;
        }

        return output;
      },
      stringify: (data) => {
        let output;

        try {
          output = Bson.serialize(data);
        } catch (err) {
          output = undefined;
        }

        return output;
      },
    },
  },
};
