const jobRepo = require("../repositories/job.repository");

exports.createJob = (data, user, callback) => {
  const job = {
    title: data.title,
    description: data.description,
    status: "OPEN",
    company_id: user.company_id
  };

  jobRepo.createJob(job, callback);
};

exports.listJobs = (user, callback) => {
  jobRepo.getJobsByCompany(user.company_id, callback);
};

exports.updateJob = (jobId, data, callback) => {
  jobRepo.updateJob(jobId, data, callback);
};

exports.deleteJob = (jobId, callback) => {
  jobRepo.deleteJob(jobId, callback);
};
