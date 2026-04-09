import axios from "axios";

// Lokal: backend :5000. Production (mis. Vercel Services): API di path /_/backend/api — sama origin dengan frontend.
const defaultBaseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api"
    : "/_/backend/api";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || defaultBaseURL,
  withCredentials: true,
});

export default api;
