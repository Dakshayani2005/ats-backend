const appService = require("../services/application.service");

exports.apply = (req, res) => {
  appService.applyForJob(req.body.job_id, req.user, (err, result) => {
    if (err) return res.status(400).json({ message: err });

    res.status(201).json({
      message: "Application submitted successfully",
      applicationId: result.insertId
    });
  });
};

exports.updateStage = (req, res) => {
  appService.changeStage(
    req.params.id,
    req.body.stage,
    req.user,
    (err) => {
      if (err) return res.status(400).json({ message: err });
      res.json({ message: "Application stage updated" });
    }
  );
};

exports.myApplications = (req, res) => {
  appService.getCandidateApplications(req.user, (err, apps) => {
    if (err) return res.status(500).json({ message: "Error fetching applications" });
    res.json(apps);
  });
};

exports.jobApplications = (req, res) => {
  appService.getApplicationsForJob(req.params.jobId, (err, apps) => {
    if (err) return res.status(500).json({ message: "Error fetching applications" });
    res.json(apps);
  });
};

exports.history = (req, res) => {
  appService.getApplicationHistory(req.params.id, (err, history) => {
    if (err) return res.status(500).json({ message: "Error fetching history" });
    res.json(history);
  });
};

exports.jobApplicationsByStage = (req, res) => {
  appService.getApplicationsByStage(
    req.params.jobId,
    req.query.stage,
    (err, apps) => {
      if (err) return res.status(500).json({ message: "Error fetching data" });
      res.json(apps);
    }
  );
};
