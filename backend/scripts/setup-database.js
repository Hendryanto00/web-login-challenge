/**
 * Membuat database + tabel users jika belum ada (idempoten).
 * Dipanggil dari postinstall (gagal koneksi = peringatan saja, exit 0)
 * atau `npm run db:setup` (gagal koneksi = exit 1).
 */
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

const root = path.join(__dirname, "..");
const envPath = path.join(root, ".env");
const examplePath = path.join(root, ".env.example");

if (fs.existsSync(envPath)) {
  require("dotenv").config({ path: envPath });
} else if (fs.existsSync(examplePath)) {
  require("dotenv").config({ path: examplePath });
}

const host = process.env.DB_HOST || "localhost";
const user = process.env.DB_USER || "root";
const password =
  process.env.DB_PASSWORD === undefined ? "" : process.env.DB_PASSWORD;
const dbNameRaw = process.env.DB_NAME || "login_app";
const hasUsername = process.env.DB_HAS_USERNAME === "true";

const isPostinstall = process.env.npm_lifecycle_event === "postinstall";

function safeDbName(name) {
  if (!/^[a-zA-Z0-9_]+$/.test(name)) {
    throw new Error(
      `DB_NAME tidak valid: "${name}" (hanya huruf, angka, underscore).`
    );
  }
  return name;
}

const tableSqlNoUsername = `
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`;

const tableSqlUsername = `
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  username VARCHAR(100) DEFAULT NULL,
  password VARCHAR(255) NOT NULL,
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`;

async function main() {
  if (process.env.SKIP_DB_AUTO_SETUP === "true") {
    console.log("[setup-db] SKIP_DB_AUTO_SETUP=true — lewati setup database.");
    return;
  }

  let dbName;
  try {
    dbName = safeDbName(dbNameRaw);
  } catch (e) {
    console.error("[setup-db]", e.message);
    process.exitCode = isPostinstall ? 0 : 1;
    return;
  }

  let conn;
  try {
    conn = await mysql.createConnection({
      host,
      user,
      password,
      multipleStatements: true,
    });
  } catch (err) {
    const msg =
      "[setup-db] Tidak bisa konek ke MySQL. Pastikan server MySQL jalan dan DB_* di .env benar.";
    if (isPostinstall) {
      console.warn(msg);
      console.warn(
        "         (npm install tetap sukses — jalankan `npm run db:setup` di folder backend setelah MySQL siap.)"
      );
      console.warn("         Detail:", err.message);
      return;
    }
    console.error(msg);
    console.error(err.message);
    process.exitCode = 1;
    return;
  }

  try {
    await conn.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await conn.query(`USE \`${dbName}\``);
    await conn.query(hasUsername ? tableSqlUsername : tableSqlNoUsername);

    if (process.env.SKIP_DB_SEED === "true") {
      console.log("[setup-db] Database & tabel siap (tanpa seed user).");
      return;
    }

    const [rows] = await conn.query(
      "SELECT COUNT(*) AS c FROM users LIMIT 1"
    );
    const count = rows[0]?.c ?? 0;
    if (Number(count) > 0) {
      console.log("[setup-db] Database & tabel users siap (sudah ada data).");
      return;
    }

    const devEmail = "admin@mail.com";
    const devPassword = "987654321";
    const hash = bcrypt.hashSync(devPassword, 10);

    if (hasUsername) {
      await conn.query(
        "INSERT INTO users (email, username, password) VALUES (?, NULL, ?)",
        [devEmail, hash]
      );
    } else {
      await conn.query("INSERT INTO users (email, password) VALUES (?, ?)", [
        devEmail,
        hash,
      ]);
    }

    console.log("[setup-db] Database & tabel siap.");
    console.log(
      `[setup-db] User contoh (development): email ${devEmail} / password ${devPassword}`
    );
    console.log(
      "[setup-db] Ganti password ini sebelum production; hapus user uji jika tidak perlu."
    );
  } catch (err) {
    if (isPostinstall) {
      console.warn("[setup-db] Setup DB gagal:", err.message);
      console.warn(
        "         Perbaiki MySQL/hak akses user, lalu jalankan: npm run db:setup"
      );
    } else {
      console.error("[setup-db] Gagal:", err.message);
      process.exitCode = 1;
    }
  } finally {
    if (conn) await conn.end().catch(() => {});
  }
}

main().catch((e) => {
  console.error("[setup-db]", e);
  process.exitCode = isPostinstall ? 0 : 1;
});
