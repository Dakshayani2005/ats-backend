const db = require("../config/db");

exports.createApplication = (data, callback) => {
  const sql = `
    INSERT INTO applications (job_id, candidate_id, stage)
    VALUES (?, ?, 'APPLIED')
  `;
  db.query(sql, [data.job_id, data.candidate_id], callback);
};

exports.findById = (id, callback) => {
  db.query("SELECT * FROM applications WHERE id = ?", [id], callback);
};

exports.updateStage = (id, stage, callback) => {
  db.query(
    "UPDATE applications SET stage = ? WHERE id = ?",
    [stage, id],
    callback
  );
};


exports.findByCandidate = (candidateId, callback) => {
  const sql = `
    SELECT a.*, j.title AS job_title
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    WHERE a.candidate_id = ?
  `;
  db.query(sql, [candidateId], callback);
};

exports.findByJob = (jobId, callback) => {
  const sql = `
    SELECT a.*, u.email AS candidate_email
    FROM applications a
    JOIN users u ON a.candidate_id = u.id
    WHERE a.job_id = ?
  `;
  db.query(sql, [jobId], callback);
};

exports.findByJobAndStage = (jobId, stage, callback) => {
  const sql = `
    SELECT a.*, u.email AS candidate_email
    FROM applications a
    JOIN users u ON a.candidate_id = u.id
    WHERE a.job_id = ? AND a.stage = ?
  `;
  db.query(sql, [jobId, stage], callback);
};

