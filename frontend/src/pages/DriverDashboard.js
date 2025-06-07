import React from 'react';
import Navbar from '../components/Navbar';

export default function DriverDashboard({ user }) {
  return (
    <>
      <Navbar user={user} />
      <div style={styles.container}>
        <h1>Driver Dashboard</h1>
        <p>View your assigned trips, earnings, and daily summary.</p>
      </div>
    </>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '100px',
  }
};
