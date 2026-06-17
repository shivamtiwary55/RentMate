import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Home from './pages/student/Home.jsx';
import Quiz from './pages/student/Quiz.jsx';
import Dashboard from './pages/landlord/Dashboard.jsx';
import AdminPanel from './pages/admin/AdminPanel.jsx';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student routes */}
        <Route path="/" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/quiz" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Quiz />
          </ProtectedRoute>
        } />

        {/* Landlord routes */}
        <Route path="/landlord/dashboard" element={
          <ProtectedRoute allowedRoles={['landlord']}>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPanel />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;