import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import TeamMembers from './pages/TeamMembers';
import Login from './pages/Login';
import Register from './pages/Register';

const AppLayout: React.FC = () => {
  return (
    <div className="h-screen w-full overflow-hidden bg-[#F0F2F5] dark:bg-[#111B21] flex flex-col lg:flex-row font-sans transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto overflow-x-hidden">
        <main className="flex-1 py-4 sm:py-5 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/team-members" element={<TeamMembers />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
