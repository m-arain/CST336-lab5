const mysql = require('mysql');

const pool  = mysql.createPool({
    connectionLimit: 10,
    host: "ohunm00fjsjs1uzy.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "v9tid6uhybayb785",
    password: "gaqjjfal9a42zqa3",
    database: "tp6vspalnktxzlm5"
});

module.exports = pool;
