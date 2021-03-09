const { arrFindByValue, valueChecker } = require("./util/Handlers");
const dbManager = require("./util/dbManager");
const defOptions = {
  adapter: "json",
  name: "database",
  path: "oriodb",
  deleteEmptyArray: true
};

module.exports = ({
  /**
   * Data saving function.
   * @returns {Array}
   * @example <db>.all();
  */
  all() {
    return dbManager(defOptions.adapter).all(defOptions.path, defOptions.name);
  },
  /**
   * Data saving function.
   * @param {string} key - The key used to save data.
   * @param {any} value - Data to be saved.
   * @returns {any}
   * @example <db>.set("a", "Hello world!");
  */
  set(key, value) {
    if (!key) throw new Error("You must spesify an key!");
    if (!valueChecker(value)) throw new Error("You must spesify an value!");
    
    return dbManager(defOptions.adapter).set(key, value, defOptions.path, defOptions.name);
  },
  /**
   * Data extraction function.
   * @param {string} key - The key that will be used to pull the data.
   * @returns {any}
   * @example <db>.get("a");
  */
  get(key) {
    if (!key) throw new Error("You must spesify an key!");
    
    return dbManager(defOptions.adapter).get(key, defOptions.path, defOptions.name);
  },
  /**
   * Send data to array function.
   * @param {string} key - The key used to save data.
   * @param {any} value - Data to be saved.
   * @returns {Array}
   * @example <db>.push("a", "Hello world!");
   */
  push(key, value) {
    if (!key) throw new Error("You must spesify an key!");
    if (!valueChecker(value)) throw new Error("You must spesify an value!");
    
    let fetchedData = dbManager(defOptions.adapter).get(key, defOptions.path, defOptions.name);
    fetchedData = fetchedData || [];
    if (!fetchedData || !Array.isArray(fetchedData)) return undefined;
    
    fetchedData.push(value);
    
    return dbManager(defOptions.adapter).set(key, fetchedData, defOptions.path, defOptions.name);
  },
  /**
   * Function to delete data from array.
   * @param {string} key - The key used to fetch data.
   * @param {any} value - Data to be deleted.
   * @returns {Array}
   * @example <db>.unpush("a", "Hello world!");
   */
  unpush(key, value) {
    if (!key) throw new Error("You must spesify an key!");
    if (!valueChecker(value) || Array.isArray(value)) throw new Error("You must spesify an value!");
    
    let fetchedData = dbManager(defOptions.adapter).get(key, defOptions.path, defOptions.name);
    if (!fetchedData || !Array.isArray(fetchedData)) return undefined;
    else fetchedData = arrFindByValue(fetchedData, value);
    
    if (fetchedData.length === 0 && defOptions.deleteEmptyArray) return dbManager(defOptions.adapter).delete(key, defOptions.path, defOptions.name);
    
    return dbManager(defOptions.adapter).set(key, fetchedData, defOptions.path, defOptions.name);
  },
  /**
   * The function of adding numbers to data that is a number.
   * @param {string} key - The key used to save data.
   * @param {number} value - Data to be saved.
   * @returns {number}
   * @example <db>.add("a", 1);
   */
  add(key, value) {
    if (!key) throw new Error("You must spesify an key!");
    if (!valueChecker(value)) throw new Error("You must spesify an value!");
    if (isNaN(value)) throw new TypeError("You must to write in number format!");

    let data = dbManager(defOptions.adapter).get(key, defOptions.path, defOptions.name) || 0;
    if (isNaN(data)) throw new Error("This old data must be a number!");

    return dbManager(defOptions.adapter).set(key, data + value, defOptions.path, defOptions.name);
  },
  /**
   * The function of extracting numbers from data that is a number.
   * @param {string} key - The key used to save data.
   * @param {number} value - Data to be saved.
   * @returns {number}
   * @example <db>.substract("a", 1);
   */
  substract(key, value) {
    if (!key) throw new Error("You must spesify an key!");
    if (!valueChecker(value)) throw new Error("You must spesify an value!");
    if (isNaN(value)) throw new TypeError("You must to write in number format!");

    let data = dbManager(defOptions.adapter).get(key, defOptions.path, defOptions.name) || 0;
    if (isNaN(data)) throw new Error("This old data must be a number!");

    return dbManager(defOptions.adapter).set(key, data - value, defOptions.path, defOptions.name);
  },
  /**
   * Data delete function.
   * @param {string} key - The key that will be used to pull the data.
   * @returns {any}
   * @example <db>.delete("a");
   */
  delete(key) {
    if (!key) throw new Error("You must spesify an key!");
    
    return dbManager(defOptions.adapter).delete(key, defOptions.path, defOptions.name);
  },
  /**
   * Database reset function.
   * @param {string} key - The key that will be used to pull the data.
   * @returns {boolean}
   * @example <db>.deleteAll();
  */
  deleteAll() {
    const data = dbManager(defOptions.adapter).all(defOptions.path, defOptions.name);
    
    for (let i = 0; data.length > i; i++) { dbManager(defOptions.adapter).delete(data[i], defOptions.path, defOptions.name) }
    
    return true;
  }
}); 

module.exports.DatabaseWithOptions = ((options = defOptions) => {
  options = Object.assign(defOptions, typeof options === "object" && !Array.isArray(options) ? options : {});
  if (!["json", "bson", "yaml"].includes(options.adapter)) throw new Error("You must specify a valid adapter! json,yaml or bson");
  
  return ({
    /**
     * Data saving function.
     * @returns {Array}
     * @example <db>.all();
    */
    all() {
      return dbManager(defOptions.adapter).all(defOptions.path, defOptions.name);
    },
    /**
     * Data saving function.
     * @param {string} key - The key used to save data.
     * @param {any} value - Data to be saved.
     * @returns {any}
     * @example <db>.set("a", "Hello world!");
    */
    set(key, value) {
      if (!key) throw new Error("You must spesify an key!");
      if (!valueChecker(value)) throw new Error("You must spesify an value!");
    
      return dbManager(options.adapter).set(key, value, options.path, options.name);
    },
    /**
     * Data extraction function.
     * @param {string} key - The key that will be used to pull the data.
     * @returns {any}
     * @example <db>.get("a");
    */
    get(key) {
      if (!key) throw new Error("You must spesify an key!");
    
      return dbManager(options.adapter).get(key, options.path, options.name);
    },
    /**
     * Send data to array function.
     * @param {string} key - The key used to save data.
     * @param {any} value - Data to be saved.
     * @returns {Array}
     * @example <db>.push("a", "Hello world!");
    */
    push(key, value) {
      if (!key) throw new Error("You must spesify an key!");
      if (!valueChecker(value)) throw new Error("You must spesify an value!");
    
      let fetchedData = dbManager(options.adapter).get(key, options.path, options.name);
      fetchedData = fetchedData || [];
      if (!fetchedData || !Array.isArray(fetchedData)) return undefined;
    
      fetchedData.push(value);
    
      return dbManager(options.adapter).set(key, fetchedData, options.path, options.name);
    },
    /**
     * Function to delete data from array.
     * @param {string} key - The key used to fetch data.
     * @param {any} value - Data to be deleted.
     * @returns {Array}
     * @example <db>.unpush("a", "Hello world!");
    */
    unpush(key, value) {
      if (!key) throw new Error("You must spesify an key!");
      if (!valueChecker(value) || Array.isArray(value)) throw new Error("You must spesify an value!");
    
      let fetchedData = dbManager(options.adapter).get(key, options.path, options.name);
      if (!fetchedData || !Array.isArray(fetchedData)) return undefined;
      else fetchedData = arrFindByValue(fetchedData, value);
    
      if (fetchedData.length === 0 && options.deleteEmptyArray) return dbManager(options.adapter).delete(key, options.path, options.name);
    
      return dbManager(options.adapter).set(key, fetchedData, options.path, options.name);
    },
    /**
     * The function of adding numbers to data that is a number.
     * @param {string} key - The key used to save data.
     * @param {number} value - Data to be saved.
     * @returns {number}
     * @example <db>.add("a", 1);
    */
    add(key, value) {
      if (!key) throw new Error("You must spesify an key!");
      if (!valueChecker(value)) throw new Error("You must spesify an value!");
      if (isNaN(value)) throw new TypeError("You must to write in number format!");

      let data = dbManager(options.adapter).get(key, options.path, options.name) || 0;
      if (isNaN(data)) throw new Error("This old data must be a number!");

      return dbManager(options.adapter).set(key, data + value, options.path, options.name);
    },
    /**
     * The function of extracting numbers from data that is a number.
     * @param {string} key - The key used to save data.
     * @param {number} value - Data to be saved.
     * @returns {number}
     * @example <db>.substract("a", 1);
    */
    substract(key, value) {
      if (!key) throw new Error("You must spesify an key!");
      if (!valueChecker(value)) throw new Error("You must spesify an value!");
      if (isNaN(value)) throw new TypeError("You must to write in number format!");

      let data = dbManager(options.adapter).get(key, options.path, options.name) || 0;
      if (isNaN(data)) throw new Error("This old data must be a number!");

      return dbManager(options.adapter).set(key, data - value, options.path, options.name);
    },
    /**
     * Data delete function.
     * @param {string} key - The key that will be used to pull the data.
     * @returns {any}
     * @example <db>.delete("a");
    */
    delete(key) {
      if (!key) throw new Error("You must spesify an key!");
    
      return dbManager(options.adapter).delete(key, options.path, options.name);
    },
    /**
     * Database reset function.
     * @param {string} key - The key that will be used to pull the data.
     * @returns {boolean}
     * @example <db>.deleteAll();
    */
    deleteAll() {
      const data = dbManager(options.adapter).all(options.path, options.name);
    
      for (let i = 0; data.length > i; i++) { dbManager(options.adapter).delete(data[i], options.path, options.name) }
    
      return true;
    }
  });
});