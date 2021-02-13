# orio.db (1.0.0)
![Download](https://img.shields.io/npm/dt/orio.db.svg?style=flat-square) 
![NpmStats](https://nodei.co/npm/orio.db.png?downloads=true&stars=true)

| Documentation | Developer Blog |
| :---: | :---: |
| [sherlockyigit.github.io/orio.db-docs](https://sherlockyigit.github.io/orio.db-docs) | *Soon..* |

## Installation
* **Node.js 10.0.0 or newer is required.**  
* `npm install orio.db` 

## Example
```js
let db = require("orio.db");
db = new db({
  databaseName: "oriodb", // Default option is myDatabase 
  deleteEmptyArray: true // Default option is false
});

// You fetch all the data saved in the database.
db.all();
// > [ { KEY: key, VALUE: value }, ... ]

// Sets data in created database.
db.set("user", { id: 1 });
// > { id: 1 }

// You fetch if there is data in the database created.
db.get("user");
// > { id: 1 }

// You check if there is data in the database created.
db.has("user");
// > true or false

// You push data to the array in the database created with the key.
db.push("user.ranks", "admin");
// > [ "admin" ]
/* or */
db.push("user.ranks", { rankName: "manager" });
// > [ "admin", { rankName: "manager" }  ]

// You unpush data to the array in the database created with the key.
db.unpush("user.ranks", "admin");
// > [ { rankName: "manager" }  ]
/* or */
db.unpush("user.ranks", { rankName: "manager" });
// > []

// You add number to the created database.
db.add("user.money", 500);
// > 500 

// You subtract number to the created database.
db.substract("user.money", 200);
// > 300

// You delete data from the created database.
db.delete("user"); 
// > true or false

// You delete all the data in the database.
db.deleteAll();
// > true or false
```
## Extras
* A simple object-oriented database package made with vweevers's level package.
* You can come to the [discord server](https://discord.gg/YdHRnsc) to get support.
* If you want to make a snake game, you can use the [discord-snakegame](https://npmjs.com/discord-snakegame) module.
