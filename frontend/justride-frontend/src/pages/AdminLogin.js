import React, { useState } from 'react';
import axios from 'axios';
import logo from '../assets/logo.png'; // Make sure logo.png is inside src/assets/

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      setMessage('Please fill all fields!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/admin/login', 
        { username, password }, 
        { headers: { 'Content-Type': 'application/json' } }
      );
      localStorage.setItem('token', response.data.token);
      setMessage('Login successful! Redirecting...');
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Invalid username or password!');
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      setMessage('Please enter your email to reset password.');
      return;
    }
    setMessage(`If an account exists with ${email}, password reset instructions have been sent.`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f2f5' }}>
      <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '300px' }}>
        
        {/* Logo on top */}
        <img 
          src={logo} 
          alt="JustRide Logo" 
          style={{ width: '100px', height: 'auto', display: 'block', margin: '0 auto 20px auto' }} 
        />

        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Admin Login</h2>

        {!showForgotPassword ? (
          <>
            <input 
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <input 
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            />

            <div style={{ textAlign: 'right', marginBottom: '15px' }}>
              <span 
                style={{ color: '#007bff', cursor: 'pointer', fontSize: '14px' }}
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot password?
              </span>
            </div>

            <button 
              onClick={handleLogin}
              style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Login
            </button>
          </>
        ) : (
          <>
            <input 
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <button 
              onClick={handleForgotPassword}
              style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Send Reset Instructions
            </button>

            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <span 
                style={{ color: '#007bff', cursor: 'pointer', fontSize: '14px' }}
                onClick={() => setShowForgotPassword(false)}
              >
                Back to login
              </span>
            </div>
          </>
        )}

        {message && <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>{message}</p>}
      </div>
    </div>
  );
}

export default AdminLogin;
