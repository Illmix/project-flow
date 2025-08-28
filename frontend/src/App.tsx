import './App.css'
import {Navigate, Route, Routes} from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import {useAuth} from "./hooks/useAuth.ts";
import MainLayout from "./components/layout/MainLayout.tsx";
import ProjectsPage from "./pages/project/ProjectsPage.tsx";
import ProjectDetailsPage from "./pages/project/ProjectDetailsPage.tsx";
import SkillsPage from "./pages/skill/SkillsPage.tsx";

function App() {
  const { user } = useAuth();
  return (
      <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* --- Protected Routes --- */}
          <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<div className="w-full">
                      Hello {user?.Name}
                  </div>} />
                  <Route path="/projects/" element={<ProjectsPage/>} />
                  <Route path="/project/:publicId" element={<ProjectDetailsPage />} />
                  <Route path="/skills/" element={<SkillsPage/>} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Route>
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
  )
}

export default App
