const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  validateLoginIdentifier,
  validatePassword,
} = require("../utils/validation");

const COOKIE_MAX_AGE_MS = 60 * 60 * 1000; // 1 jam, selaras JWT

function hasUsernameColumn() {
  return process.env.DB_HAS_USERNAME === "true";
}

function getCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE_MS,
    path: "/",
  };
}

function buildUserPayload(row) {
  const out = { id: row.id, email: row.email };
  if (row.username !== undefined && row.username !== null) {
    out.username = row.username;
  }
  return out;
}

// LOGIN (default: email saja — cocok dengan tabel users tanpa kolom username)
exports.login = (req, res) => {
  const body = req.body || {};
  const identifier = body.identifier ?? body.email;
  const { password } = body;

  const idErr = validateLoginIdentifier(identifier);
  if (idErr) {
    return res.status(400).json({ message: idErr });
  }

  const passErr = validatePassword(password);
  if (passErr) {
    return res.status(400).json({ message: passErr });
  }

  const trimmed = String(identifier).trim();

  const sql = hasUsernameColumn()
    ? "SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1"
    : "SELECT * FROM users WHERE email = ? LIMIT 1";
  const params = hasUsernameColumn() ? [trimmed, trimmed] : [trimmed];

  db.query(sql, params, async (err, results) => {
    if (err) return res.status(500).json({ message: "Terjadi kesalahan server" });

    if (results.length === 0) {
      return res.status(401).json({
        message: "Email/username atau password salah",
      });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Email/username atau password salah",
      });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, getCookieOptions());

    res.json({
      message: "Login berhasil",
      user: buildUserPayload(user),
    });
  });
};

exports.getDashboard = (req, res) => {
  const sql = hasUsernameColumn()
    ? "SELECT id, email, username FROM users WHERE id = ? LIMIT 1"
    : "SELECT id, email FROM users WHERE id = ? LIMIT 1";

  db.query(sql, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ message: "Terjadi kesalahan server" });
    if (!results.length) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    res.json({
      message: "Selamat datang di dashboard",
      user: buildUserPayload(results[0]),
    });
  });
};

// LOGOUT
exports.logout = (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
  });

  res.json({
    message: "Logout berhasil",
  });
};
