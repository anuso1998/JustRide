// src/components/Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ user }) {
  const nav = useNavigate();

  const logout = () => {
    localStorage.removeItem('user');
    nav('/');
  };

  return (
    <div style={styles.navbar}>
      <span>Welcome, {user.name} ({user.role})</span>
      <button onClick={logout} style={styles.logout}>Logout</button>
    </div>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '16px',
  },
  logout: {
    padding: '6px 12px',
    backgroundColor: '#fff',
    color: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};
