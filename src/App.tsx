import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/auth.context";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Dashboard />} />
        </Routes>
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </>
  );
}

export default App;
