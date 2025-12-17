const appRepo = require("../repositories/application.repository");
const historyRepo = require("../repositories/applicationHistory.repository");
const workflow = require("./applicationWorkflow.service");
const db = require("../config/db");
const emailQueue = require("../queues/email.queue");

/**
 * Candidate applies for a job
 */
exports.applyForJob = (jobId, user, callback) => {
  const data = {
    job_id: jobId,
    candidate_id: user.id
  };

  appRepo.createApplication(data, (err, result) => {
    if (err) return callback(err);

    // 📧 Email to candidate
    emailQueue.add("sendEmail", {
      to: user.email,
      subject: "Application Submitted",
      text: "Your application has been successfully submitted."
    });

    // 📧 Email to recruiter
    emailQueue.add("sendEmail", {
      to: process.env.RECRUITER_EMAIL,
      subject: "New Application Received",
      text: "A new candidate has applied for your job posting."
    });

    callback(null, result);
  });
};

/**
 * Recruiter changes application stage (WITH TRANSACTION)
 */
exports.changeStage = (appId, newStage, user, callback) => {
  db.getConnection((err, connection) => {
    if (err) return callback("Database connection error");

    connection.beginTransaction(err => {
      if (err) return callback("Transaction start failed");

      connection.query(
        "SELECT * FROM applications WHERE id = ?",
        [appId],
        (err, apps) => {
          if (err || apps.length === 0) {
            return connection.rollback(() =>
              callback("Application not found")
            );
          }

          const app = apps[0];

          if (!workflow.canTransition(app.stage, newStage)) {
            return connection.rollback(() =>
              callback("Invalid stage transition")
            );
          }

          connection.query(
            "UPDATE applications SET stage = ? WHERE id = ?",
            [newStage, appId],
            err => {
              if (err) {
                return connection.rollback(() =>
                  callback("Stage update failed")
                );
              }

              connection.query(
                `INSERT INTO application_history
                 (application_id, from_stage, to_stage, changed_by)
                 VALUES (?, ?, ?, ?)`,
                [appId, app.stage, newStage, user.id],
                err => {
                  if (err) {
                    return connection.rollback(() =>
                      callback("History insert failed")
                    );
                  }

                  connection.commit(err => {
                    if (err) {
                      return callback("Transaction commit failed");
                    }

                    connection.release();

                    // 📧 Email on stage change
                    emailQueue.add("sendEmail", {
                      to: process.env.CANDIDATE_EMAIL,
                      subject: "Application Status Updated",
                      text: `Your application status has been updated to ${newStage}.`
                    });

                    callback(null);
                  });
                }
              );
            }
          );
        }
      );
    });
  });
};

/**
 * Candidate views own applications
 */
exports.getCandidateApplications = (user, callback) => {
  appRepo.findByCandidate(user.id, callback);
};

/**
 * Recruiter views applications for a job
 */
exports.getApplicationsForJob = (jobId, callback) => {
  appRepo.findByJob(jobId, callback);
};

/**
 * View application history
 */
exports.getApplicationHistory = (applicationId, callback) => {
  historyRepo.getHistoryByApplication(applicationId, callback);
};

/**
 * Filter applications by stage
 */
exports.getApplicationsByStage = (jobId, stage, callback) => {
  appRepo.findByJobAndStage(jobId, stage, callback);
};
