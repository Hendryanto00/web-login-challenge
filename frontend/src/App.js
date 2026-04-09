import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        containerStyle={{
          top: 16,
          zIndex: 99999,
        }}
        gutter={8}
        toastOptions={{
          duration: 3200,
          style: {
            background: "#f5f3ff",
            color: "#3730a3",
            borderRadius: "10px",
            padding: "10px 14px",
            fontSize: "14px",
            fontWeight: 600,
            maxWidth: 320,
            boxShadow: "0 8px 24px rgba(79, 70, 229, 0.2)",
            border: "1px solid #a5b4fc",
          },
          success: {
            iconTheme: {
              primary: "#4f46e5",
              secondary: "#ffffff",
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
