const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const rbac = require("../middlewares/rbac.middleware");
const controller = require("../controllers/application.controller");

// Candidate applies
router.post(
  "/",
  auth,
  rbac("CANDIDATE"),
  controller.apply
);

// Recruiter updates stage
router.patch(
  "/:id/stage",
  auth,
  rbac("RECRUITER"),
  controller.updateStage
);

module.exports = router;

// Candidate: view own applications
router.get(
  "/my",
  auth,
  rbac("CANDIDATE"),
  controller.myApplications
);

// Recruiter: view applications for a job
router.get(
  "/job/:jobId",
  auth,
  rbac("RECRUITER", "HIRING_MANAGER"),
  controller.jobApplications
);

// View application history (candidate + recruiter)
router.get(
  "/:id/history",
  auth,
  rbac("CANDIDATE", "RECRUITER", "HIRING_MANAGER"),
  controller.history
);

router.get(
  "/job/:jobId/filter",
  auth,
  rbac("RECRUITER"),
  controller.jobApplicationsByStage
);
