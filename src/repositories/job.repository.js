const db = require("../config/db");

exports.createJob = (job, callback) => {
  const sql = `
    INSERT INTO jobs (title, description, status, company_id)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [job.title, job.description, job.status, job.company_id],
    callback
  );
};

exports.getJobsByCompany = (companyId, callback) => {
  const sql = "SELECT * FROM jobs WHERE company_id = ?";
  db.query(sql, [companyId], callback);
};

exports.updateJob = (jobId, data, callback) => {
  const sql = `
    UPDATE jobs
    SET title = ?, description = ?, status = ?
    WHERE id = ?
  `;
  db.query(sql, [data.title, data.description, data.status, jobId], callback);
};

exports.deleteJob = (jobId, callback) => {
  db.query("DELETE FROM jobs WHERE id = ?", [jobId], callback);
};
