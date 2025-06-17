import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logos/JUSTRIDE-01.png'; // Adjust path if needed

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full bg-white text-black rounded-xl shadow-lg p-8 space-y-6 text-center">
        <img
          src={logo}
          alt="JustRide Logo"
          style={{ width: '120px', height: 'auto', objectFit: 'contain', margin: '0 auto 1rem' }}
        />

        <h1 className="text-4xl font-bold">Welcome to JustRide</h1>
        <p className="text-lg text-gray-700">Modern NEMT Dispatch Software</p>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Driver Signup
          </button>
        </div>

        <div className="text-left mt-8">
          <h2 className="text-2xl font-semibold mb-2">Features</h2>
          <ul className="list-disc list-inside text-gray-800">
            <li>Bulk Trip Upload (Excel/CSV)</li>
            <li>Driver Assignment Dashboard</li>
            <li>Firebase Authentication</li>
            <li>Driver Portal to Track Trips</li>
          </ul>
        </div>

        <div className="text-left mt-8">
          <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
          <form className="space-y-4">
            <div className="flex gap-4 flex-wrap">
              <input
                type="text"
                placeholder="Name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <textarea
              placeholder="Message"
              className="w-full px-4 py-2 border border-gray-300 rounded h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}