import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import './index.css';
import AdminDashboard from './pages/AdminDashboard';
import DriverDashboard from './pages/DriverDashboard';
import Welcome from './pages/Welcome';


function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  return (
 <Routes>
  <Route path="/signup" element={<Signup />} />
  <Route path="/welcome" element={<Welcome />} />
  <Route path="/" element={<Welcome />} />
  <Route path="/admin" element={
    user && user.role === 'admin'
      ? <AdminDashboard user={user} />
      : <Navigate to="/login" />
  } />
  <Route path="/driver" element={
    user && user.role === 'driver'
      ? <DriverDashboard user={user} />
      : <Navigate to="/login" />
  } />
  <Route path="/login" element={<Login setUser={setUser} />} />
  <Route path="/dashboard" element={
    user ? (
      user.role === 'admin'
        ? <AdminDashboard user={user} />
        : <DriverDashboard user={user} />
    ) : (
      <Navigate to="/login" />
    )
  } />
</Routes>
  );
}

export default App;
