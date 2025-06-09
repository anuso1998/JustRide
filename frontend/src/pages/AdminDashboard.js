// src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { db } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [rows, setRows] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [selectedTrips, setSelectedTrips] = useState(new Set());
  const [assignedTrips, setAssignedTrips] = useState([]);
  const [driver, setDriver] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [tab, setTab] = useState('trips');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [driverSelectedTrips, setDriverSelectedTrips] = useState(new Set());

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'users'));
        const driverList = snapshot.docs
          .map(doc => doc.data())
          .filter(user => user.role === 'driver')
          .map(user => ({ name: user.name || user.email, ...user }));
        setDrivers(driverList);
      } catch (err) {
        console.error('Error fetching drivers:', err);
      }
    };

    const fetchAssignedTrips = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'assignedTrips'));
        const assigned = snapshot.docs.map(doc => doc.data());
        setAssignedTrips(assigned);
      } catch (err) {
        console.error('Error fetching assigned trips:', err);
      }
    };

    fetchDrivers();
    fetchAssignedTrips();
  }, []);

  const handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet, { defval: '' });

      if (parsedData.length > 0) {
        setHeaders(Object.keys(parsedData[0]));
        setRows(parsedData);
      } else {
        setRows([]);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const logout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const sortByPickupCity = () => {
    const sorted = [...rows].sort((a, b) => (a['Pickup City'] || '').localeCompare(b['Pickup City'] || ''));
    setRows(sorted);
  };

  const sortByTripNumber = () => {
    const sorted = [...rows].sort((a, b) => (a['Trip Number'] || '').localeCompare(b['Trip Number'] || ''));
    setRows(sorted);
  };

  const toggleSelect = (tripId) => {
    const newSet = new Set(selectedTrips);
    const baseId = tripId.slice(0, -1);
    rows.forEach(row => {
      if (row['Trip Number']?.startsWith(baseId)) {
        if (newSet.has(row['Trip Number'])) newSet.delete(row['Trip Number']);
        else newSet.add(row['Trip Number']);
      }
    });
    setSelectedTrips(newSet);
  };

  const toggleDriverTripSelect = (tripId) => {
    const newSet = new Set(driverSelectedTrips);
    const baseId = tripId.slice(0, -1);
    const allTrips = assignedTrips.flatMap(g => g.trips);
    allTrips.forEach(row => {
      if (row['Trip Number']?.startsWith(baseId)) {
        if (newSet.has(row['Trip Number'])) newSet.delete(row['Trip Number']);
        else newSet.add(row['Trip Number']);
      }
    });
    setDriverSelectedTrips(newSet);
  };

  const groupTrips = (tripArray) => {
    const groups = {};
    tripArray.forEach(row => {
      const id = row['Trip Number']?.slice(0, -1);
      if (!groups[id]) groups[id] = [];
      groups[id].push(row);
    });
    return Object.values(groups);
  };

  const assignTripsToDriver = async () => {
    if (!driver || selectedTrips.size === 0) return;
    const newAssigned = [];
    const unassigned = [];

    rows.forEach(row => {
      const baseId = row['Trip Number']?.slice(0, -1);
      if (selectedTrips.has(row['Trip Number']) || selectedTrips.has(baseId)) {
        newAssigned.push(row);
      } else {
        unassigned.push(row);
      }
    });

    try {
      await addDoc(collection(db, 'assignedTrips'), {
        driver,
        date: new Date().toISOString().split('T')[0],
        trips: newAssigned
      });
      setRows(unassigned);
      setAssignedTrips(prev => [...prev, { driver, date: new Date().toISOString().split('T')[0], trips: newAssigned }]);
      setSelectedTrips(new Set());
     } catch (err) {
      console.error('Error saving assigned trips:', err);
    }
  };

  const handleUnassign = (driverName, groupIndex) => {
    const updatedAssigned = [...assignedTrips];
    const [removedGroup] = updatedAssigned.splice(groupIndex, 1);
    setRows(prev => [...prev, ...removedGroup.trips]);
    setAssignedTrips(updatedAssigned);
  };

  const clearAssignedTrips = async () => {
    const querySnapshot = await getDocs(collection(db, 'assignedTrips'));
    const confirm = window.confirm("Are you sure you want to delete ALL assigned trips?");
    if (!confirm) return;

    const deletePromises = querySnapshot.docs.map(docSnap => 
      deleteDoc(doc(db, 'assignedTrips', docSnap.id))
    );

    await Promise.all(deletePromises);
    setAssignedTrips([]);
    alert('All assigned trips have been cleared.');
  };

  const formatTime = (value) => {
        if (!value || typeof value !== 'string' && typeof value !== 'number') return '';
        const digits = String(value).padStart(4, '0').replace(/\D/g, '');
        if (digits.length !== 4) return value;
        const hours = digits.slice(0, 2);
  const minutes = digits.slice(2);
  return `${hours}:${minutes}`;
};

const renderTripGroup = (group, groupKey, selectFn, selectedSet) => (
  <div key={groupKey} style={{ border: '2px solid #ccc', borderRadius: '8px', padding: '10px', marginBottom: '10px' }}>
    {group.map((trip, idx) => (
      <div
        key={idx}
        onClick={() => selectFn(trip['Trip Number'])}
        style={{ border: selectedSet.has(trip['Trip Number']) ? '2px solid blue' : '1px solid #ccc', borderRadius: '6px', padding: '10px', marginBottom: '5px', cursor: 'pointer' }}
      >
        <input
          type="checkbox"
          checked={selectedSet.has(trip['Trip Number'])}
          onChange={() => selectFn(trip['Trip Number'])}
        />
        {headers.map((h, j) => (
          <div key={j}>
            <strong>{h}:</strong>{' '}
            {h.toLowerCase().includes('time') ? formatTime(trip[h]) : trip[h]}
          </div>
        ))}
      </div>
    ))}
  </div>
);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Admin Dashboard</h2>
        <div>
          <button onClick={clearAssignedTrips} style={{ backgroundColor: 'red', color: 'white', marginRight: '10px' }}>Clear Assigned Trips</button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <button onClick={() => setTab('trips')}>Trips</button>
        <button onClick={() => setTab('drivers')}>Drivers</button>
      </div>

      {tab === 'trips' && (
        <div>
          <input type="file" accept=".xlsx,.xls,.csv,.txt" onChange={handleFile} />

          {rows.length > 0 && (
            <div>
              <div style={{ marginTop: '10px' }}>
                <button onClick={sortByPickupCity}>Sort by Pickup City</button>
                <button onClick={sortByTripNumber}>Sort by Trip Number</button>
                <select value={driver} onChange={(e) => setDriver(e.target.value)}>
                  <option value="">Assign to Driver</option>
                  {drivers.map((d, idx) => (
                    <option key={idx} value={d.name}>{d.name}</option>
                  ))}
                </select>
                <button onClick={assignTripsToDriver}>Assign</button>
              </div>
              <div style={{ marginTop: '20px' }}>
                {groupTrips(rows).map((group, idx) => renderTripGroup(group, idx, toggleSelect, selectedTrips))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'drivers' && (
        <div>
          <h3>Drivers Info</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {drivers.map((d, idx) => (
              <button key={idx} onClick={() => setSelectedDriver(d)}>{d.name}</button>
            ))}
          </div>
          {selectedDriver && (
            <div style={{ marginTop: '20px' }}>
              <h4>{selectedDriver.name}'s Assigned Trips</h4>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <div style={{ marginTop: '10px' }}>
                {assignedTrips
                  .map((group, index) => {
                    if (group.driver !== selectedDriver.name || group.date !== selectedDate) return null;
                    return (
                      <div key={index} style={{ marginBottom: '20px' }}>
                        <button onClick={() => handleUnassign(selectedDriver.name, index)}>Unassign</button>
                        {groupTrips(group.trips).map((grp, idx) => renderTripGroup(grp, `d-${index}-${idx}`, toggleDriverTripSelect, driverSelectedTrips))}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
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
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '10px',
    width: '300px'
  },
  legBlock: {
    marginBottom: '10px'
  }
};
