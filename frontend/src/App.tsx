import './App.css'
import {Navigate, Route, Routes} from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import {useAuth} from "./hooks/useAuth.ts";

function App() {
  const { user } = useAuth();
  return (
      <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* --- Protected Routes --- */}
          <Route element={<ProtectedRoute />}>

              <Route path="/dashboard" element={<>
               Hello {user?.Name}
              </>} />
              <Route path="/project/:publicId" element={<></>} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
  )
}

export default App
