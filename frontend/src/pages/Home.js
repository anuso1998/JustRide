import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const nav = useNavigate();

  return (
    <div style={styles.container}>
      <h2>Welcome to JustRide</h2>
      <div style={styles.buttonGroup}>
        <button style={styles.button} onClick={() => nav('/login')}>Driver Login</button>
        <button style={styles.button} onClick={() => nav('/signup')}>Driver Signup</button>
        <button style={styles.button} onClick={() => nav('/login?admin=true')}>Admin Login</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '100px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginTop: '20px',
  },
  button: {
    padding: '12px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};
