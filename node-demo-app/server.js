const express = require("express");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 3000;

// Home page
app.get("/", (req, res) => {
  res.send("Hello from Node.js running in Docker on AWS! 🚀");
});

// Health check (use this for ECS / ALB health checks)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Shows which container answered (useful when running multiple ECS tasks)
app.get("/info", (req, res) => {
  res.json({
    message: "Container info",
    hostname: os.hostname(),
    node_version: process.version,
    environment: process.env.APP_ENV || "not-set",
    uptime_seconds: Math.round(process.uptime()),
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
