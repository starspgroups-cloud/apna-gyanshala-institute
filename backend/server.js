require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ================= MIDDLEWARE =================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// ================= DATABASE =================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((error) => {
    console.log("❌ MongoDB Error:", error);
  });

// ================= ROUTES =================

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

// ================= TEST ROUTE =================

app.get("/", (req, res) => {
  res.send("🔥 Apna Gyanshala Backend Running");
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend healthy",
    time: new Date().toISOString(),
  });
});

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
