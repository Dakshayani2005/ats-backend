const jobService = require("../services/job.service");

exports.createJob = (req, res) => {
  jobService.createJob(req.body, req.user, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error creating job" });
    }

    res.status(201).json({
      message: "Job created successfully",
      jobId: result.insertId
    });
  });
};

exports.getJobs = (req, res) => {
  jobService.listJobs(req.user, (err, jobs) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching jobs" });
    }

    res.json(jobs);
  });
};

exports.updateJob = (req, res) => {
  jobService.updateJob(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ message: "Error updating job" });
    res.json({ message: "Job updated successfully" });
  });
};

exports.deleteJob = (req, res) => {
  jobService.deleteJob(req.params.id, (err) => {
    if (err) return res.status(500).json({ message: "Error deleting job" });
    res.json({ message: "Job deleted successfully" });
  });
};
