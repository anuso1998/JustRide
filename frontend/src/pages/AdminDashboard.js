// src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [rows, setRows] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [selectedTrips, setSelectedTrips] = useState(new Set());
  const [assignedTrips, setAssignedTrips] = useState([]);
  const [driver, setDriver] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'users'));
        const driverList = snapshot.docs
          .map(doc => doc.data())
          .filter(user => user.role === 'driver')
          .map(user => ({ name: user.name || user.email, email: user.email }));
        setDrivers(driverList);
      } catch (err) {
        console.error('Error fetching drivers:', err);
      }
    };
    fetchDrivers();
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

  const groupByTripNumber = () => {
    const tripKey = headers.find(h => h.toLowerCase().includes('trip number'));
    if (tripKey) {
      const grouped = [...rows].sort((a, b) => {
        const tripA = a[tripKey] || '';
        const tripB = b[tripKey] || '';
        const baseA = tripA.slice(0, -1);
        const baseB = tripB.slice(0, -1);

        if (baseA !== baseB) return baseA.localeCompare(baseB);
        return tripA.slice(-1).localeCompare(tripB.slice(-1));
      });
      setRows(grouped);
    }
  };

  const sortByPickupCity = () => {
    const pickupKey = headers.find(h => h.toLowerCase().includes('pickup city'));
    if (pickupKey) {
      const sorted = [...rows].sort((a, b) => {
        const cityA = a[pickupKey]?.toLowerCase() || '';
        const cityB = b[pickupKey]?.toLowerCase() || '';
        return cityA.localeCompare(cityB);
      });
      setRows(sorted);
    }
  };

  const formatTime = (value) => {
    if (!value) return '';
    const digits = String(value).padStart(4, '0').replace(/[^0-9]/g, '');
    if (digits.length === 4) {
      const hours = digits.slice(0, 2);
      const minutes = digits.slice(2);
      return `${hours}:${minutes}`;
    }
    return value;
  };

  const groupLegs = () => {
    const tripKey = headers.find(h => h.toLowerCase().includes('trip number'));
    if (!tripKey) return rows;

    const map = new Map();
    rows.forEach(row => {
      const tripId = row[tripKey];
      if (tripId && tripId.length > 1) {
        const base = tripId.slice(0, -1);
        if (!map.has(base)) map.set(base, []);
        map.get(base).push(row);
      }
    });

    return Array.from(map.entries());
  };

  const toggleSelection = (tripId) => {
    setSelectedTrips(prev => {
      const copy = new Set(prev);
      if (copy.has(tripId)) copy.delete(tripId);
      else copy.add(tripId);
      return copy;
    });
  };

  const assignTripsToDriver = () => {
    if (!driver) return alert('Please select a driver first');

    const assigned = [...assignedTrips];
    const tripKey = headers.find(h => h.toLowerCase().includes('trip number'));

    const newAssignedTripGroups = [];

    tripGroups.forEach(([groupId, group]) => {
      const id = group[0][tripKey];
      if (selectedTrips.has(id)) {
        assigned.push({ driver, trips: group });
        newAssignedTripGroups.push(groupId);
      }
    });

    setAssignedTrips(assigned);
    setRows(prev => prev.filter(row => {
      const tripId = row[tripKey];
      const groupBase = tripId?.slice(0, -1);
      return !newAssignedTripGroups.includes(groupBase);
    }));
    setSelectedTrips(new Set());
    alert(`Assigned ${newAssignedTripGroups.length} trip group(s) to ${driver}`);
  };

  const unassignTrip = (index) => {
    const updated = [...assignedTrips];
    updated.splice(index, 1);
    setAssignedTrips(updated);
  };

  const logout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const tripGroups = groupLegs();

  return (
    <div style={styles.container}>
      <div style={styles.headerBar}>
        <h2 style={styles.heading}>Admin Dashboard</h2>
        <button onClick={logout} style={styles.logoutButton}>Logout</button>
      </div>

      <div style={styles.tabBar}>
        <button onClick={() => setActiveTab('dashboard')} style={styles.tabButton}>Dashboard</button>
        <button onClick={() => setActiveTab('drivers')} style={styles.tabButton}>Drivers</button>
      </div>

      {activeTab === 'dashboard' && (
        <>
          <input type="file" accept=".xlsx,.xls,.csv,.txt" onChange={handleFile} style={styles.fileInput} />

          {rows.length > 0 && (
            <>
              <div style={styles.buttonGroup}>
                <button onClick={groupByTripNumber} style={styles.button}>Group by Trip Number</button>
                <button onClick={sortByPickupCity} style={styles.button}>Sort by Pickup City</button>
                <select
                  value={driver}
                  onChange={e => setDriver(e.target.value)}
                  style={{ padding: '8px', fontSize: '14px' }}
                >
                  <option value="">Select Driver</option>
                  {drivers.map(d => <option key={d.email} value={d.name}>{d.name}</option>)}
                </select>
                <button onClick={assignTripsToDriver} style={styles.button}>Assign to Driver</button>
              </div>

              <h3 style={styles.subHeading}>Preview ({rows.length} rows)</h3>
              <div style={styles.cardContainer}>
                {tripGroups.map(([groupId, group], idx) => (
                  <div
                    key={idx}
                    style={styles.card}
                    onClick={() => {
                      const tripId = group[0][headers.find(h => h.toLowerCase().includes('trip number'))];
                      toggleSelection(tripId);
                    }}
                  >
                    <div style={styles.cardHeader}>Trip Group: {groupId}</div>
                    <div style={styles.legRow}>
                      {group.map((trip, tIdx) => (
                        <div key={tIdx} style={styles.legColumn}>
                          <input
                            type="checkbox"
                            checked={selectedTrips.has(trip[headers.find(h => h.toLowerCase().includes('trip number'))])}
                            onChange={() => toggleSelection(trip[headers.find(h => h.toLowerCase().includes('trip number'))])}
                          />
                          {headers.map((header, hIdx) => (
                            <div key={hIdx} style={styles.dataRow}>
                              <strong>{header}:</strong> {header.toLowerCase().includes('time') ? formatTime(trip[header]) : trip[header]}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {assignedTrips.length > 0 && (
                <div style={{ marginTop: '30px' }}>
                  <h3>Assigned Trips</h3>
                  {assignedTrips.map((assign, idx) => (
                    <div key={idx} style={styles.card}>
                      <strong>Driver:</strong> {assign.driver} {' '}
                      <button onClick={() => unassignTrip(idx)} style={{ marginLeft: '10px', color: 'red' }}>Unassign</button>
                      {assign.trips.map((trip, tIdx) => (
                        <div key={tIdx} style={{ marginTop: '10px' }}>
                          {headers.map((header, hIdx) => (
                            <div key={hIdx}>
                              <strong>{header}:</strong> {trip[header]}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {activeTab === 'drivers' && (
        <div>
          <h3>Driver Information</h3>
          {drivers.map((d, i) => {
            const trips = assignedTrips.filter(t => t.driver === d.name);
            return (
              <div key={i} style={styles.card}>
                <strong>Name:</strong> {d.name}<br />
                <strong>Email:</strong> {d.email}<br />
                <strong>Trips Today:</strong> {trips.length}<br />
                {trips.map((group, gi) => (
                  <div key={gi} style={{ marginTop: '10px' }}>
                    {group.trips.map((trip, tIdx) => (
                      <div key={tIdx}>
                        {headers.map((header, hIdx) => (
                          <div key={hIdx}>
                            <strong>{header}:</strong> {trip[header]}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '30px',
    fontFamily: 'Arial, sans-serif',
    background: '#f8f9fa',
    minHeight: '100vh'
  },
  headerBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  heading: {
    margin: 0
  },
  logoutButton: {
    padding: '8px 16px',
    background: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  tabBar: {
    marginBottom: '20px'
  },
  tabButton: {
    padding: '10px 20px',
    marginRight: '10px',
    background: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  fileInput: {
    marginBottom: '20px'
  },
  buttonGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px'
  },
  button: {
    padding: '8px 16px',
    background: '#2ecc71',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  subHeading: {
    marginTop: '20px'
  },
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px'
  },
  card: {
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    minWidth: '250px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  cardHeader: {
    fontWeight: 'bold',
    marginBottom: '10px'
  },
  legRow: {
    display: 'flex',
    gap: '10px'
  },
  legColumn: {
    border: '1px solid #eee',
    borderRadius: '4px',
    padding: '8px',
    marginRight: '8px'
  },
  dataRow: {
    marginBottom: '4px'
  }
};
