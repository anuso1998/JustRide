import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { db } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { cities } from '../utils/cities_missouri_full'; // Adjust path if needed

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // radius in miles
  const toRad = angle => (angle * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

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
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});
  const toggleExpand = (key) => {
    setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

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

  const handleTripClick = (trip) => {
    const cityName = trip['Pickup City'];
    if (!cityName) return;

    const cityInfo = cities.find(c => c.city.toLowerCase() === cityName.toLowerCase());
    if (!cityInfo) return;

    const nearbyDrivers = drivers.filter(driver => {
      if (!driver.city) return false;
      const driverCity = cities.find(c => c.city.toLowerCase() === driver.city.toLowerCase());
      if (!driverCity) return false;

      const distance = haversineDistance(cityInfo.lat, cityInfo.lng, driverCity.lat, driverCity.lng);
      return distance <= 75;
    });

    setFilteredDrivers(nearbyDrivers);
  };

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

  const handleUnassign = async (driverName, groupIndex) => {
    const snapshot = await getDocs(collection(db, 'assignedTrips'));
    const matchingDoc = snapshot.docs.find(doc => {
      const data = doc.data();
      return data.driver === driverName && data.date === selectedDate;
    });

    if (matchingDoc) {
      try {
        await deleteDoc(doc(db, 'assignedTrips', matchingDoc.id));
        const updatedAssigned = [...assignedTrips];
        const [removedGroup] = updatedAssigned.splice(groupIndex, 1);
        setRows(prev => [...prev, ...removedGroup.trips]);
        setAssignedTrips(updatedAssigned);
        alert('Trip group unassigned and removed from database.');
      } catch (err) {
        console.error('Error deleting from Firestore:', err);
        alert('Error removing assigned trip from database.');
      }
    }
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

const renderTripGroup = (group, groupKey, selectFn, selectedSet) => {
  const isExpanded = expandedGroups[groupKey];

  return (
    <div key={groupKey} style={{ border: '2px solid #ccc', borderRadius: '8px', marginBottom: '10px' }}>
      {/* Summary Header */}
      <div
        onClick={() => toggleExpand(groupKey)}
          className="cursor-pointer bg-gray-200 dark:bg-gray-700 text-black dark:text-white p-3 flex justify-between items-center"
      >
        <div className="text-black dark:text-white">
          <strong>Trip Number:</strong> {group[0]['Trip Number'] || 'N/A'}
        </div>
        <div style={{ fontSize: '20px' }}>{isExpanded ? '▼' : '▶'}</div>
      </div>

      {/* Expanded Trip Detail */}
      {isExpanded && (
        <div style={{ padding: '10px' }}>
          {group.map((trip, idx) => (
            <div
              key={idx}
              onClick={() => selectFn(trip['Trip Number'])}
              className={`border ${selectedSet.has(trip['Trip Number']) ? 'border-blue-500' : 'border-gray-300'} rounded-md p-3 mb-2 cursor-pointer bg-gray-50 dark:bg-gray-800 text-black dark:text-white`}
              style={{
                border: selectedSet.has(trip['Trip Number']) ? '2px solid blue' : '1px solid #ccc',
                borderRadius: '6px',
                padding: '10px',
                marginBottom: '5px',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={selectedSet.has(trip['Trip Number'])}
                onChange={() => selectFn(trip['Trip Number'])}
              />
              {headers.map((h, j) =>
                trip[h] ? (
                  <div key={j} className="text-black dark:text-white">
                    <strong>{h}:</strong> {h.toLowerCase().includes('time') ? formatTime(trip[h]) : trip[h]}
                  </div>
                ) : null
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


  return (
    <div className="min-h-screen p-6 bg-white dark:bg-black text-black dark:text-white">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Admin Dashboard</h2>
        <div>
          <button onClick={clearAssignedTrips} style={{ backgroundColor: 'red', color: 'white', marginRight: '10px' }}>Clear Assigned Trips</button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="flex gap-4 my-6">
  <button
    onClick={() => setTab('trips')}
    className={`px-4 py-2 rounded ${
      tab === 'trips'
        ? 'bg-blue-600 text-white'
        : 'bg-gray-300 dark:bg-gray-700 text-black dark:text-white'
    }`}
  >
    Trips
  </button>
  <button
    onClick={() => setTab('drivers')}
    className={`px-4 py-2 rounded ${
      tab === 'drivers'
        ? 'bg-blue-600 text-white'
        : 'bg-gray-300 dark:bg-gray-700 text-black dark:text-white'
    }`}
  >
    Drivers
  </button>
</div>

      {tab === 'trips' && (
  <div>
    <input type="file" accept=".xlsx,.xls,.csv,.txt" onChange={handleFile} />

    {rows.length > 0 && (
      <div>
        {/* ✅ Sort & Assign Bar */}
        <div className="flex flex-wrap items-center gap-4 my-4">
          <button
            onClick={sortByPickupCity}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sort by Pickup City
          </button>
          <button
            onClick={sortByTripNumber}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sort by Trip Number
          </button>

          <div className="flex items-center gap-2">
            <label htmlFor="assignDriver" className="font-medium">Assign to Driver:</label>
            <select
              id="assignDriver"
              value={driver}
              onChange={(e) => setDriver(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 bg-white dark:bg-gray-900 text-black dark:text-white"
            >
              <option value="">Select Driver</option>
              {(filteredDrivers.length > 0 ? filteredDrivers : drivers).map((d, idx) => (
                <option key={idx} value={d.name}>{d.name}</option>
              ))}
            </select>
            <button
              onClick={assignTripsToDriver}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Assign
            </button>
          </div>
        </div>

        {/* ✅ Trips List */}
        <div style={{ marginTop: '20px' }}>
          {groupTrips(rows).map((group, idx) =>
            renderTripGroup(group, idx, toggleSelect, selectedTrips)
          )}
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
  <button
    key={idx}
    onClick={() => setSelectedDriver(d)}
    className="px-4 py-2 m-1 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600"
  >
    {d.name}
  </button>
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
