/**
 * Validasi identifier login (email atau username).
 * Jika mengandung @, wajib format email valid.
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

function validateLoginIdentifier(identifier) {
  if (!identifier || !String(identifier).trim()) {
    return "Email atau username wajib diisi";
  }
  const s = String(identifier).trim();
  const allowUsername = process.env.DB_HAS_USERNAME === "true";
  if (!allowUsername) {
    if (!isValidEmail(s)) {
      return "Format email tidak valid";
    }
    return null;
  }
  if (s.includes("@") && !isValidEmail(s)) {
    return "Format email tidak valid";
  }
  return null;
}

function validatePassword(password) {
  if (!password || !String(password).trim()) {
    return "Password wajib diisi";
  }
  return null;
}

module.exports = {
  isValidEmail,
  validateLoginIdentifier,
  validatePassword,
};
