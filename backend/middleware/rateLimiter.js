const rateLimit = require("express-rate-limit");

/** Maksimal 5 percobaan login per menit per IP */
const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Terlalu banyak percobaan login. Silakan coba lagi dalam satu menit.",
  },
});

module.exports = { loginLimiter };
