const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const rbac = require("../middlewares/rbac.middleware");
const jobController = require("../controllers/job.controller");

// Recruiter only
router.post(
  "/",
  authMiddleware,
  rbac("RECRUITER"),
  jobController.createJob
);

// Recruiter & Hiring Manager can view
router.get(
  "/",
  authMiddleware,
  rbac("RECRUITER", "HIRING_MANAGER"),
  jobController.getJobs
);

module.exports = router;

router.put(
  "/:id",
  authMiddleware,
  rbac("RECRUITER"),
  jobController.updateJob
);

router.delete(
  "/:id",
  authMiddleware,
  rbac("RECRUITER"),
  jobController.deleteJob
);
