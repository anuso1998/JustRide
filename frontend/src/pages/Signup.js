import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { cities } from '../utils/cities_missouri_full'; // Adjust path if needed

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

    // Basic validations
    const pass = form.password;
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{7,}$/;
    if (!passRegex.test(pass)) {
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
        name: `${form.name} ${form.lastName}`,
        email: form.email,
        city: form.city,
        address: form.address,
        dob: form.dob,
        phone: form.phone,
        lat,
        lng,
        role: 'driver'
      });

      alert('Signup successful');
      nav('/login');
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed');
    }
  };

  return (
    <>
      <form onSubmit={submit} style={styles.form}>
        <input
          placeholder="First Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          style={styles.input}
          required
        />
        <input
          placeholder="Last Name"
          value={form.lastName}
          onChange={e => setForm({ ...form, lastName: e.target.value })}
          style={styles.input}
          required
        />
        <input
          placeholder="City"
          value={form.city}
          onChange={e => setForm({ ...form, city: e.target.value })}
          style={styles.input}
          required
        />
        <input
          placeholder="Full Address"
          value={form.address}
          onChange={e => setForm({ ...form, address: e.target.value })}
          style={styles.input}
          required
        />
        <input
          type="date"
          value={form.dob}
          onChange={e => setForm({ ...form, dob: e.target.value })}
          style={styles.input}
          required
        />
        <input
          placeholder="Phone (xxx) xxx-xxxx"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: formatPhone(e.target.value) })}
          style={styles.input}
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          style={styles.input}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          style={styles.input}
          required
        />
        <input
          placeholder="Confirm Password"
          type="password"
          value={form.confirmPassword}
          onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Signup</button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <button
          onClick={() => nav('/')}
          style={{
            backgroundColor: '#6c757d',
            color: '#fff',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Go to Home
        </button>
      </div>
    </>
  );
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '300px',
    margin: '50px auto 20px auto',
    gap: '12px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    outline: 'none'
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer'
  }
};
