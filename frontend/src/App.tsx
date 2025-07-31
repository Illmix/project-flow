import './App.css'
import {Navigate, Route, Routes} from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import LoginPage from "./pages/LoginPage.tsx";

function App() {

  return (
      <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* --- Protected Routes --- */}
          <Route element={<ProtectedRoute />}>

              <Route path="/dashboard" element={<>{}</>} />
              <Route path="/project/:publicId" element={<></>} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
  )
}

export default App
