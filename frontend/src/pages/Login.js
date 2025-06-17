// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function Login({ setUser }) {
  const [form, setForm] = useState({ email: '', password: '', role: 'driver' });
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (!userDoc.exists()) {
        alert('No user profile found');
        return;
      }

      const userData = userDoc.data();

      if (userData.role !== form.role) {
        alert(`Role mismatch. You are registered as a ${userData.role}.`);
        return;
      }

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      nav('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Login failed: ' + err.message);
    }
  };

  return (
    <div style={styles.wrapper}>
      <form onSubmit={submit} style={styles.form}>
        <h2 style={styles.title}>Login</h2>

        <select
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
          style={styles.input}
          required
        >
          <option value="driver">Driver</option>
          <option value="admin">Admin</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Login</button>
        <button
          type="button"
          onClick={() => nav('/')}
          style={{ ...styles.button, backgroundColor: '#6c757d', marginTop: '10px' }}
        >
          Go to Home
        </button>
      </form>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(to right, #007bff, #00c6ff)',
    padding: '20px',
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    padding: '30px',
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '10px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#007bff',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '12px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  }
};