const db = require("../config/db");

exports.findUserByEmail = (email, callback) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], callback);
};

exports.createUser = (user, callback) => {
  const sql = `
    INSERT INTO users (email, password, role, company_id)
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, [
    user.email,
    user.password,
    user.role,
    user.company_id || null
  ], callback);
};
