
import React from 'react';

export default function Dashboard({ user }) {
  return (
    <div>
      <Route path="/dashboard" element={
  user ? (
    user.role === 'admin' ? <AdminDashboard user={user} /> : <DriverDashboard user={user} />
  ) : (
    <Navigate to="/login" />
  )
} />

      <h2>Welcome {user.name}</h2>
      <p>Role: {user.role}</p>
      {user.role === 'driver' ? <p>Trips | Reports</p> : <p>Admin Panel</p>}
    </div>
  );
}

