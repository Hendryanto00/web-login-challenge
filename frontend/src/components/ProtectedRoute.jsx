import { AuthProvider } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
