import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Trips from './pages/Trips';
import Drivers from './pages/Drivers';
import DayEndReport from './pages/DayEndReport';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/trips" element={isAuthenticated ? <Trips /> : <Navigate to="/" />} />
        <Route path="/drivers" element={isAuthenticated ? <Drivers /> : <Navigate to="/" />} />
        <Route path="/dayendreport" element={isAuthenticated ? <DayEndReport /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
