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
    <div className="flex justify-between items-center px-6 py-4 bg-black text-white text-lg shadow-md">
      <span>
        Welcome, <span className="font-semibold text-lime-400">{user.name}</span> ({user.role})
      </span>

      <img
        src={logo}
        alt="JustRide Logo"
        className="h-10 object-contain"
      />

      <button
        onClick={logout}
        className="bg-lime-400 text-black px-4 py-2 rounded hover:bg-lime-300 transition"
      >
        Logout
      </button>
    </div>
  );
}
