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
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-white/80">Select a date to view assigned trips</p>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-amber-100 text-black p-2 rounded focus:outline-none focus:ring-2 focus:ring-amber-300"
          />

          {assignedTrips.length === 0 ? (
            <p className="text-gray-400 mt-4">No trips assigned for this date.</p>
          ) : (
            <div className="space-y-4">
              {groupTrips(assignedTrips).map((group, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-md rounded p-4 border border-white/20">
                  <h3 className="font-semibold mb-2">Trip Group {idx + 1}</h3>
                  <ul className="list-disc list-inside text-white/90">
                    {group.map((trip, i) => (
                      <li key={i} className="text-sm">{trip['Trip Number']} - {trip.destination}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
