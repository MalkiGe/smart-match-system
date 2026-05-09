const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const authRoutes = require("./src/routes/auth.routes");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("SmartMatch server is running 🚀");
});

module.exports = app;
