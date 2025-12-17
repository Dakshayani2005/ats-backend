const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const jobRoutes = require("./routes/job.routes");
app.use("/jobs", jobRoutes);

const applicationRoutes = require("./routes/application.routes");
app.use("/applications", applicationRoutes);

app.get("/", (req, res) => {
  res.send("ATS Backend is running");
});



module.exports = app;
