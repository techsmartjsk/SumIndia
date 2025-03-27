const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/prescriptions", prescriptionRoutes);

module.exports = app;
