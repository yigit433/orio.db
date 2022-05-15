const { baseGet, findNearestData, valueChecker } = require("./util/handlers");
const dbManager = require("./util/dbManager");
const options = require("./configLoader");

module.exports = {
  /**
   * All data extraction function.
   * @returns {Array}
   * @example db.all();
   */
  all() {
    return dbManager(options.adapter).all(options.path, options.name);
  },
  /**
   * Data saving function.
   * @param {string} key - The key used to save data.
   * @param {any} value - Data to be saved.
   * @returns {any}
   * @example db.set("a", "Hello world!");
   */
  set(key, value) {
    key = key.split(".");

    if (!key) {
      throw new Error("You must spesify an Key!");
    } else if (!valueChecker(value)) {
      throw new Error("You must spesify an Value!");
    } else {
      return dbManager(options.adapter).set(
        key,
        value,
        options.path,
        options.name
      );
    }
  },
  /**
   * Data extraction function.
   * @param {string} key - The key that will be used to pull the data.
   * @returns {any}
   * @example db.get("a");
   */
  fetch(key) {
    key = key.split(".");

    let data = dbManager(options.adapter).all(options.path, options.name);
    data = data.find((val) => val.ID === key[0]);

    if (!data) {
      return;
    } else {
      return typeof data.data === "object" && !Array.isArray(data.data)
        ? key.length > 1
          ? baseGet(key, data.data)
          : data.data
        : data.data;
    }
  },
  /**
   * Data extraction function.
   * @param {string} key - The key that will be used to pull the data.
   * @returns {any}
   * @example db.get("a");
   */
  get(key) {
    key = key.split(".");

    let data = dbManager(options.adapter).all(options.path, options.name);
    data = data.find((val) => val.ID === key[0]);

    if (!data) {
      return;
    } else {
      return typeof data.data === "object" && !Array.isArray(data.data)
        ? key.length > 1
          ? baseGet(key, data.data)
          : data.data
        : data.data;
    }
  },
  /**
   * Data check function.
   * @param {string} key - The key that will be used to pull the data.
   * @returns {boolean}
   * @example db.has("a");
   */
  has(key) {
    let data = dbManager(options.adapter).all(options.path, options.name);
    data = data.find((val) => val.ID === key.split(".")[0]);

    if (!data) {
      return Boolean(data);
    } else {
      data = module.exports.get(key);

      return Boolean(data);
    }
  },
  /**
   * The function of adding numbers to data that is a number.
   * @param {string} key - The key used to save data.
   * @param {number} value - Data to be saved.
   * @returns {number}
   * @example db.add("a", 1);
   */
  add(key, value) {
    key = key.split(".");

    if (!key) {
      throw new Error("You must spesify an Key!");
    } else if (!valueChecker(value) || isNaN(value)) {
      throw new Error("You must spesify a Number!");
    } else {
      let data = dbManager(options.adapter).all(options.path, options.name);
      data = data.some((val) => val.ID === key[0])
        ? key.length > 1
          ? baseGet(key, data.find((val) => val.ID === key[0]).data)
          : data.find((val) => val.ID === key[0]).data
        : 0;

      if (isNaN(data)) {
        throw new Error("This old data must be a number!");
      } else {
        return dbManager(options.adapter).set(
          key,
          value + data,
          options.path,
          options.name
        );
      }
    }
  },
  /**
   * The function of extracting numbers from data that is a number.
   * @param {string} key - The key used to save data.
   * @param {number} value - Data to be saved.
   * @returns {number}
   * @example db.substract("a", 1);
   */
  substract(key, value) {
    key = key.split(".");

    if (!key) {
      throw new Error("You must spesify an Key!");
    } else if (!valueChecker(value) || isNaN(value)) {
      throw new Error("You must spesify a Number!");
    } else {
      let data = dbManager(options.adapter).all(options.path, options.name);
      data = data.some((val) => val.ID === key[0])
        ? key.length > 1
          ? baseGet(key, data.find((val) => val.ID === key[0]).data)
          : data.find((val) => val.ID === key[0]).data
        : 0;

      if (isNaN(data)) {
        throw new Error("This old data must be a number!");
      } else {
        return dbManager(options.adapter).set(
          key,
          data - value,
          options.path,
          options.name
        );
      }
    }
  },
  /**
   * Send data to array function.
   * @param {string} key - The key used to save data.
   * @param {any} value - Data to be saved.
   * @returns {Array}
   * @example db.push("a", "Hello world!");
   */
  push(key, value) {
    key = key.split(".");

    if (!key) {
      throw new Error("You must spesify an Key!");
    } else if (!valueChecker(value)) {
      throw new Error("You must spesify a Value!");
    } else {
      let data = dbManager(options.adapter).all(options.path, options.name);
      data = data.find((val) => val.ID === key[0]) || [];

      if (data) {
        data = data.data || [];

        if (typeof data === "object" && !Array.isArray(data)) {
          data = baseGet(key, data);

          if (!data) {
            data = [];
          }
        }

        if (Array.isArray(data)) {
          return dbManager(options.adapter).set(
            key,
            [...data, value],
            options.path,
            options.name
          );
        } else {
          throw new Error("This old data must be an Array!");
        }
      } else {
        return;
      }
    }
  },
  /**
   * Function to delete data from array.
   * @param {string} key - The key used to fetch data.
   * @param {any} value - Data to be deleted.
   * @returns {Array}
   * @example db.unpush("a", "Hello world!");
   */
  unpush(key, value) {
    key = key.split(".");

    if (!key) {
      throw new Error("You must spesify an Key!");
    } else if (!valueChecker(value)) {
      throw new Error("You must spesify a Value!");
    } else {
      let data = dbManager(options.adapter).all(options.path, options.name);
      data = data.find((val) => val.ID === key[0]) || [];

      if (data) {
        data = data.data || [];

        if (typeof data === "object" && !Array.isArray(data)) {
          data = baseGet(key, data);

          if (!data) {
            data = [];
          }
        }

        if (Array.isArray(data)) {
          let result = findNearestData(value, data);
          result = data.filter(
            (d, ind) => !result.some((r) => r[0] === 1 && r[1] === ind)
          );

          if (result.length === 0 && options.deleteEmptyArray) {
            return dbManager(options.adapter).delete(
              key,
              options.path,
              options.name
            );
          } else {
            return dbManager(options.adapter).set(
              key,
              result,
              options.path,
              options.name
            );
          }
        } else {
          throw new Error("This old data must be an Array!");
        }
      } else {
        return;
      }
    }
  },
  /**
   * Data delete function.
   * @param {string} key - The key that will be used to pull the data.
   * @returns {boolean}
   * @example db.delete("a");
   */
  delete(key) {
    key = key.split(".");

    if (!key) {
      throw new Error("You must spesify an Key!");
    } else {
      return dbManager(options.adapter).delete(key, options.path, options.name);
    }
  },
  /**
   * Database reset function.
   * @param {string} key - The key that will be used to pull the data.
   * @returns {boolean}
   * @example <db>.deleteAll();
   */
  deleteAll() {
    let data = dbManager(options.adapter).all(options.path, options.name);

    if (data.length === 0) {
      return false;
    } else {
      for (let i = 0; data.length > i; i++) {
        dbManager(options.adapter).delete(
          data[i].ID,
          options.path,
          options.name
        );
      }

      return true;
    }
  },
};
