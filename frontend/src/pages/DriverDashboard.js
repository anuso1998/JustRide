import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from '../components/Navbar';

export default function DriverDashboard({ user }) {
  const [assignedTrips, setAssignedTrips] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchAssignedTrips = async () => {
      const snapshot = await getDocs(collection(db, 'assignedTrips'));
      const allTrips = snapshot.docs.map(doc => doc.data());
      const filtered = allTrips.filter(
        t => t.driver === user.name && t.date === selectedDate
      );
      setAssignedTrips(filtered);
    };

    if (user?.name) {
      fetchAssignedTrips();
    }
  }, [selectedDate, user]);

  const groupTrips = (trips) => {
    const groups = {};
    trips.forEach(trip => {
      const baseId = trip['Trip Number']?.slice(0, -1);
      if (!groups[baseId]) groups[baseId] = [];
      groups[baseId].push(trip);
    });
    return Object.values(groups);
  };

  return (
    <>
      <Navbar user={user} />
      <div style={styles.container}>
        <h1>Welcome, {user?.name}</h1>
        <p>Select a date to view assigned trips</p>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={styles.datePicker}
        />

        {assignedTrips.length === 0 ? (
          <p>No trips assigned for this date.</p>
        ) : (
          <div style={styles.tripContainer}>
            {assignedTrips.map((group, idx) =>
              groupTrips(group.trips).map((grp, gIdx) => (
                <div key={`${idx}-${gIdx}`} style={styles.card}>
                  <h3>Trip Group: {grp[0]['Trip Number']?.slice(0, -1)}</h3>
                  {grp.map((trip, i) => (
                    <div key={i} style={styles.legBlock}>
                      {Object.entries(trip).map(([k, v], j) => (
                        <div key={j}><strong>{k}:</strong> {v}</div>
                      ))}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  container: {
    padding: '30px',
    fontFamily: 'Arial, sans-serif'
  },
  datePicker: {
    padding: '8px',
    fontSize: '16px',
    marginBottom: '20px'
  },
  tripContainer: {
    marginTop: '20px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px'
  },
  card: {
    border: '2px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
    background: '#fff',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    minWidth: '300px'
  },
  legBlock: {
    marginTop: '10px',
    padding: '10px',
    borderTop: '1px solid #eee'
  }
};
