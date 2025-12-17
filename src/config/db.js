const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Sonu@2005",
  database: "ats_db"
});

module.exports = db;
