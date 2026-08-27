import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/Login';
import { DashboardLayout } from './pages/DashboardLayout';
import { DashboardHome } from './pages/DashboardHome';
import { EmployeePage } from './pages/employee/employee';
import ProtectedRoute from './components/ProtectedRoute';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/employee" element={<EmployeePage />} />
          </Route>
        </Route>

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;