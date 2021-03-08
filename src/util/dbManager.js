const { baseSet, baseGet, baseDelete, dataConverter } = require("./Handlers");
const Deasync = require("deasync");
const fs = require("fs");

module.exports = ((adapter) => {
  return ({
    all(path, name) {
      return Deasync((cb) => (
        fs.readdir(`${process.cwd()}/${path}`, (err, files) => {
          if (err) fs.mkdirSync(path);
          let document = [];
          
          try {
            document = fs.readFileSync(`${process.cwd()}/${path}/${name}.${adapter}`);
            document = Object.entries(dataConverter[adapter].parse(document)).map(val => ({ ID: val[0], data: val[1] }));
          } catch(err) {
            document = []
          }
          
          return cb(null, document);
        })
      ))()
    },
    set(key, value, path, name) {
      return Deasync((cb) => (
        fs.readdir(`${process.cwd()}/${path}`, (err, files) => {
          if (err) fs.mkdirSync(path);
          key = key.split(".");
          let document = {};
          
          try {
            document = fs.readFileSync(`${process.cwd()}/${path}/${name}.${adapter}`);
            document = baseSet(key, value, dataConverter[adapter].parse(document) || {});
          } catch(err) {
            document = baseSet(key, value, {});
          }
          
          fs.writeFile(`${process.cwd()}/${path}/${name}.${adapter}`, dataConverter[adapter].stringify(document), (err) => {
            if (err) throw new Error(err);
          
            return cb(null, document[key[key.length - 1]]);
          })
        })
      ))()
    },
    get(key, path, name) {
      return Deasync((cb) => (
        fs.readdir(`${process.cwd()}/${path}`, (err, files) => {
          if (err) fs.mkdirSync(path);
          key = key.split(".");
          let document = {};
          
          try {
            document = fs.readFileSync(`${process.cwd()}/${path}/${name}.${adapter}`);
            document = baseGet(key, dataConverter[adapter].parse(document));
          } catch(err) {
            document = baseGet(key, {});
          }
          
          return cb(null, document);
        })
      ))()
    },
    delete(key, path, name) {
      return Deasync((cb) => (
        fs.readdir(`${process.cwd()}/${path}`, (err, files) => {
          if (err) fs.mkdirSync(path);
          key = key.split(".");
          let document = {};
          
          try {
            document = fs.readFileSync(`${process.cwd()}/${path}/${name}.${adapter}`);
            document = baseDelete(key, dataConverter[adapter].parse(document));
          } catch(err) {
            return cb(null, false);
          }
          
          fs.writeFile(`${process.cwd()}/${path}/${name}.${adapter}`, dataConverter[adapter].stringify(document), (err) => {
            if (err) throw new Error(err);
            
            return cb(null, true);
          })
        })
      ))()
    }
  });
});