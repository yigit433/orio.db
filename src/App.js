const Level = require("level");
const { dataConverter, childSet, childGet, childDelete, arrFilter } = require('./functions/Handlers');
const Deasync = require("deasync");
const { EventEmitter } = require("events");

let db;

/**
 * @class
 * @description Orio Database
 * @extends EventEmitter
 */
class orioDB extends EventEmitter {
  /**
   * @constructor
   * @param {any} databaseName You can set the database name as desired. If you leave it blank, the database name will be "database".
   */
  constructor(options = { databaseName: "myDatabase", deleteEmptyArray: false }) {
    super();
    if (db == undefined) db = (Level(options.databaseName.length == 0 ? "myDatabase" : options.databaseName));
    
    let defOptions = { databaseName: "myDatabase", deleteEmptyArray: false };
    
    this.db = db;
    this.options = Object.assign(typeof options == "object" && !Array.isArray(options) ? options : {}, defOptions);
  }
  /**
   * You fetch all the data saved in the database.
   * @returns {array} 
   */
  all() {
    return Deasync(async function(altDb, callback) {
      let obj = [];
      
      altDb.createReadStream()
      .on('data', (data) => obj.push({ KEY: data.key.toString("utf8"), DATA: dataConverter(data.value.toString("utf8")) })) 
      .on('error', (err) => callback(null, []))
      .on('end', () => callback(null, obj))
      
    })(this.db)
  }
  /**
   * You delete all the data in the database.
   * @returns {Boolean}
   */
  deleteAll() {
    let allData = this.all();
    if (Object.keys(allData).length == 0) return false;
    for (let key in allData) {
      this.delete(key);
    }
    return true;
  }
  /**
   * Sets data in created database.
   * @param {string} key 
   * @param {any} value 
   * @returns {any}
   * @example
   * db.set('a.b.c', 'Test!') // Test!
  */
  set(key, value) {
    if (!key) throw new TypeError("Enter a key to save data!");
    if (!value) throw new TypeError("Enter a data to save data!");
    
    return Deasync((_key, _value, self, cb) => {
      if (_key.includes(".")) {
        const keys = _key.split(".");
        
        if (
          typeof (self.get(keys[0]) || {}) != "object"
          ||
          Array.isArray(self.get(keys[0]) || {})
        ) return cb("This old data must be an Object!", null);
        
        self.db.put(keys[0], JSON.stringify(childSet(keys, _value, self.get(keys[0]) || {})), (err) => {
          if (err) return cb(err, null);
          else return cb(null, self.get(keys.join(".")));
        });
      } else self.db.put(_key, (
        typeof _value == "object" ?
        JSON.stringify(_value) : _value
      ), (err) => {
          if (err) return cb(err, null);
          else return cb(null, self.get(_key));
        });
    })(key, value, this);
  }
  /**
   * You add numbers to the created database.
   * @param {string} key 
   * @param {number} number 
   * @returns {number}
   * @example
   * db.add('a.b.c', 1) or db.add('a.b.c', '1') // 1 
   */
  add(key, value) {
    if (!key) throw new TypeError("Enter a key to save data!")
    if (!value || isNaN(value)) throw new TypeError("The value you wrote must be a number!");
    
    let oldD = this.get(key) || 0;
    if (typeof dataConverter(oldD) != "number") throw new Error("This old data must be a number!");
    
    return this.set(key, oldD + value);
  }
  /**
   * You subtract numbers to the created database.
   * @param {string} key 
   * @param {number} number 
   * @returns {number}
   * @example
   * db.subtract('a.b.c', 1) or db.subtract('a.b.c', '1') // 1 
   */
  substract(key, value) {
    if (!key) throw new TypeError("Enter a key to save data!")
    if (!value || isNaN(value)) throw new TypeError("The value you wrote must be a number!");
    
    let oldD = this.get(key) || 0;
    if (typeof dataConverter(oldD) != "number") throw new Error("This old data must be a number!");
    
    return this.set(key, oldD - value);
  }
  /**
   * You send data to the array in the database created with the key.
   * @param {string} key 
   * @param {any} value 
   * @returns {object}
   * @example
   * db.push('a.b.c', 'Test!') // [ 'Test!' ] 
   */
  push(key, value) {
    if (!key) throw new TypeError("Enter a key to save data!");
    if (!value) throw new TypeError("Enter a data to save data!");
    
    let data = this.get(key) == undefined ? [] : this.get(key);
    if (!Array.isArray(data)) throw new Error("This old data must be an Array!");
    else data.push(value);
    
    return this.set(key, data);
  }
  /**
   * You delete data to the array in the database created with the key.
   * @param {string} key 
   * @param {any} value 
   * @returns {object}
   * @example
   * db.unpush('a.b.c', 'Test!') // [] 
   */
  unpush(key, value) {
    if (!key) throw new TypeError("Enter a key to save data!");
    if (!value) throw new TypeError("Enter a data to save data!");
    
    let data = this.get(key) == undefined ? [] : this.get(key);
    if (!Array.isArray(data)) throw new Error("This old data must be an Array!");
    data = arrFilter(data, value);
    if (data.length == 0 && this.options.deleteEmptyArray == true) return this.delete(key);  
    
    return this.set(key, data);
  }
  /**
   * You check if there is data in the database created.
   * @param {string} key 
   * @returns {Boolean}
   * @example
   * db.has('a.b.c') // true
   */
  has(key) {
    if (!key) throw new TypeError("Enter a key to check data!");
  
    if (this.get(key)) return true
    else return false
  }
  /**
   * You fetch data from the created database.
   * @param {string} key
   * @returns {any}
   * @example
   * db.get('a.b.c') // Test!
   */
  get(key) {
    if (!key) throw new TypeError("Enter a key to fetch data!");
    
    return Deasync((_key, self, cb) => {
      if (_key.includes(".")) {
        const keys = _key.split(".");
        
        self.db.get(keys[0], (err, value) => {
          if (err) return cb(null, null);
          else return cb(null, childGet(keys, dataConverter(value)));
        });
      } else {
        self.db.get(_key, (err, value) => {
          if (err) return cb(null, null);
          else return cb(null, dataConverter(value));
        });
      }
    })(key, this);
  }
  /**
   * You delete data from the created database.
   * @param {string} key 
   * @returns {Boolean}
   * @example
   * db.delete('a') // true
   */
  delete(key) {
    if (!key) throw new TypeError("Enter a key to delete data!");
    
    if (key.includes(".")) {
      let keys = key.split(".");
      let data = this.get(keys[0]);
      if (!data) throw new TypeError("Data not found!");
      
      let newData = childDelete(keys, data);
      
      return this.set(key.split('.')[0], newData);
    } else {
      if (!this.has(key)) throw new TypeError("Data not found!");
      
      return Deasync((key, self, cb) => self.db.del(key, (err) => err ? cb(null, false) : cb(null, true)))(key, this)
    }
  }
};
module.exports = orioDB;
