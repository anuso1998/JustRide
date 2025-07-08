import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logos/JUSTRIDE-01.png';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white px-4 py-12">
      <div className="bg-white/5 backdrop-blur-md border border-white/20 shadow-2xl rounded-xl max-w-4xl w-full p-10 text-center space-y-6">
        <img
          src={logo}
          alt="JustRide Logo"
          className="w-28 mx-auto mb-4"
        />

        <h1 className="text-4xl font-bold tracking-wide">Welcome to JustRide</h1>
        <p className="text-lg text-white/90">Modern NEMT Dispatch Software</p>

        <div className="flex flex-col md:flex-row justify-center gap-6 mt-6">
          <button
            onClick={() => navigate('/login')}
            className="bg-lime-400 text-black font-semibold px-6 py-3 rounded-full hover:bg-lime-300 transition shadow-md"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="bg-white/20 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/30 transition border border-white/30"
          >
            Driver Signup
          </button>
        </div>

        <div className="text-left mt-8">
          <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
          <ul className="list-disc list-inside space-y-2 text-white/90">
            <li>🚗 Real-time vehicle dispatch & driver tracking</li>
            <li>📅 Schedule and manage bookings with ease</li>
            <li>📍 Built-in map navigation and city coverage</li>
            <li>🔐 Secure login and user access management</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
