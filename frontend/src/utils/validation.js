/**
 * Validasi form login (client).
 * Identifier: email atau username — jika mengandung @, format email harus valid.
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

export function validateLoginForm(identifier, password) {
  const errors = {};

  if (!identifier || !String(identifier).trim()) {
    errors.identifier = "Email atau username wajib diisi";
  } else {
    const id = String(identifier).trim();
    if (id.includes("@") && !isValidEmail(id)) {
      errors.identifier = "Format email tidak valid";
    }
  }

  if (!password || !String(password).trim()) {
    errors.password = "Password wajib diisi";
  }

  return errors;
}

export function hasValidationErrors(errors) {
  return Object.keys(errors).length > 0;
}
