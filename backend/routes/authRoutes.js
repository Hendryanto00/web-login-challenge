const express = require("express");
const { login, logout, getDashboard } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const { loginLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/login", loginLimiter, login);

router.get("/dashboard", authMiddleware, getDashboard);

router.post("/logout", logout);

module.exports = router;
