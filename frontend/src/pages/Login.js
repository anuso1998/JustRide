// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import '../components/Login.css';

export default function Login({ setUser }) {
  const [form, setForm] = useState({ email: '', password: '' });
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
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      nav('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Login failed: ' + err.message);
    }
  };

  return (
    <form onSubmit={submit} className="login-form">
      <h2>Login</h2>
      <input
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        className="login-input"
        required
      />
      <input
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
        className="login-input"
        required
      />
      <button type="submit" className="login-button">Login</button>
      <button
  type="button"
  onClick={() => nav('/')}
  style={{ marginTop: '10px', backgroundColor: '#6c757d', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '5px' }}
>
  Go to Home
</button>

    </form>
  );
}
