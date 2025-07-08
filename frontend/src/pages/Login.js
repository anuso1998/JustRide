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
    <div className="flex items-center justify-center min-h-screen bg-black">
      <form
        onSubmit={submit}
        className="backdrop-blur-md bg-white/5 border border-white/20 shadow-xl p-8 rounded-xl w-full max-w-md text-white space-y-6"
      >
        <h2 className="text-3xl font-bold text-center">Welcome Back</h2>

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full p-3 bg-black/100 text-white border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-lime-400"
          required
        >
          <option value="driver">Driver</option>
          <option value="admin">Admin</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-3 bg-white/10 text-white border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-lime-400 placeholder-white/80"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-3 bg-white/10 text-white border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-lime-400 placeholder-white/80"
          required
        />

        <button
          type="submit"
          className="w-full bg-lime-400 text-black py-2 px-4 rounded hover:bg-lime-300 font-semibold transition duration-200"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
