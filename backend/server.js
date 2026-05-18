require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();


// ================= MIDDLEWARE =================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


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


// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});