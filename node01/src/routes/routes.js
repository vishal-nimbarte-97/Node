// routes/allRoutes.js
const express = require("express");
const router = express.Router();

// Import route modules
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const orderRoutes = require("./order.route");

// Import auth middleware
const authMiddleware = require("../middlewares/auth.middleware");

// Public routes
router.use("/auth", authRoutes);

// Protected routes
router.use("/api", authMiddleware, userRoutes);
router.use("/api", authMiddleware, orderRoutes);

module.exports = router;
