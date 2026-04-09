require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());

const rawOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
const allowedOrigins = rawOrigin.split(",").map((s) => s.trim()).filter(Boolean);
const corsOrigin =
  allowedOrigins.length === 0
    ? "http://localhost:3000"
    : allowedOrigins.length === 1
      ? allowedOrigins[0]
      : allowedOrigins;
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);

app.use("/api", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
