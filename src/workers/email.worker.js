require("dotenv").config();
const { Worker } = require("bullmq");
const nodemailer = require("nodemailer");
const connection = require("../config/redis");

console.log("📨 Email worker running...");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const worker = new Worker(
  "emailQueue",
  async (job) => {
    const { to, subject, text } = job.data;

    console.log("📤 Sending email to:", to);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });

    console.log("✅ Email sent to:", to);
  },
  { connection }
);

worker.on("failed", (job, err) => {
  console.error("❌ Email job failed:", err.message);
});
