import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import darkLogo from '../assets/logos/JUSTRIDE-01.png';  // your dark theme logo
import lightLogo from '../assets/logos/logo-light.png'; // your light theme logo

export default function Navbar({ user }) {
  const nav = useNavigate();

  const logout = () => {
    localStorage.removeItem('user');
    nav('/');
  };

  // NEW: Track dark/light mode
  const [isDark, setIsDark] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setIsDark(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-black text-white text-lg shadow-md">
      <span>
        Welcome, <span className="font-semibold text-lime-400">{user.name}</span> ({user.role})
      </span>

      {/* Clickable Logo */}
      <Link to="/">
        <img
          src={isDark ? darkLogo : lightLogo}
          alt="JustRide Logo"
          className="h-10 object-contain cursor-pointer"
        />
      </Link>

      <button
        onClick={logout}
        className="bg-lime-400 text-black px-4 py-2 rounded hover:bg-lime-300 transition"
      >
        Logout
      </button>
    </div>
  );
}
