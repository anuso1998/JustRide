import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { cities } from '../utils/cities_missouri_full';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
    phone: '',
    dob: '',
    address: '',
  });

  const nav = useNavigate();

  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 10);
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return value;
    const [, a, b, c] = match;
    return [a && `(${a}`, b && `) ${b}`, c && `-${c}`].filter(Boolean).join('');
  };

  const submit = async (e) => {
    e.preventDefault();

    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{7,}$/;
    if (!passRegex.test(form.password)) {
      alert('Password must be at least 7 characters and include uppercase, lowercase, number, and special character.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const cityMatch = cities.find(c => c.city.toLowerCase() === form.city.trim().toLowerCase());
    const lat = cityMatch?.lat || null;
    const lng = cityMatch?.lng || null;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        ...form,
        uid: user.uid,
        role: 'driver',
        lat,
        lng,
      });

      alert('Signup successful!');
      nav('/login');
    } catch (err) {
      console.error(err);
      alert('Signup failed: ' + err.message);
    }
  };

  const renderField = (icon, type, key, placeholder, isFullWidth = false) => (
    <div className={`${isFullWidth ? 'md:col-span-2' : ''} flex items-center gap-2 bg-black text-white border border-white/20 rounded px-3 py-2`}>
      <span className="text-lg">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: key === 'phone' ? formatPhone(e.target.value) : e.target.value })}
        className="bg-transparent flex-1 outline-none placeholder-white/70"
        required
      />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={submit}
        className="bg-black border border-white/20 shadow-xl p-8 rounded-xl w-full max-w-3xl text-white space-y-6"
      >
        <h2 className="text-3xl font-bold text-center">Sign Up</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField('👤', 'text', 'name', 'First Name')}
          {renderField('👤', 'text', 'lastName', 'Last Name')}
          {renderField('📧', 'email', 'email', 'Email')}
          {renderField('🔒', 'password', 'password', 'Password')}
          {renderField('🔒', 'password', 'confirmPassword', 'Confirm Password')}
          {renderField('📱', 'text', 'phone', 'Phone')}
          {renderField('📅', 'date', 'dob', 'Date of Birth')}
          {renderField('📍', 'text', 'city', 'City')}
          {renderField('🏠', 'text', 'address', 'Address', true)}
        </div>
        

        <button type="submit" className="w-full bg-lime-400 text-black py-2 px-4 rounded hover:bg-lime-300 font-semibold transition duration-200">
          Register
        </button>
      </form>
    </div>
  );
}
