// src/components/Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logos/JUSTRIDE-01.png';

export default function Navbar({ user }) {
  const nav = useNavigate();

  const logout = () => {
    localStorage.removeItem('user');
    nav('/');
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-blue-600 text-white text-lg shadow-md">
      <span>
        Welcome, <span className="font-semibold">{user.name}</span> ({user.role})
      </span>

      <img
        src={logo}
        alt="JustRide Logo"
        style={{ height: '40px', width: 'auto', objectFit: 'contain', margin: '0 16px' }}
      />


      <button
        onClick={logout}
        className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 transition"
      >
        Logout
      </button>
    </div>
  );
}
