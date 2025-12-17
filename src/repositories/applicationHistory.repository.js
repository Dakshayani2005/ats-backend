const db = require("../config/db");

exports.addHistory = (history, callback) => {
  const sql = `
    INSERT INTO application_history
    (application_id, from_stage, to_stage, changed_by)
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, [
    history.application_id,
    history.from_stage,
    history.to_stage,
    history.changed_by
  ], callback);
};

exports.getHistoryByApplication = (applicationId, callback) => {
  const sql = `
    SELECT h.*, u.email AS changed_by_email
    FROM application_history h
    JOIN users u ON h.changed_by = u.id
    WHERE h.application_id = ?
    ORDER BY h.changed_at ASC
  `;
  db.query(sql, [applicationId], callback);
};
