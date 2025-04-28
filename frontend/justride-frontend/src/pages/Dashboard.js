import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5', position: 'relative' }}>
      
      {/* Sidebar (Right Side) */}
      <div style={{
        width: menuOpen ? '200px' : '0',
        height: '100%',
        backgroundColor: '#007bff',
        position: 'fixed',
        top: 0,
        right: 0,
        overflowX: 'hidden',
        transition: '0.5s',
        paddingTop: '60px',
        zIndex: 2
      }}>
        {menuOpen && (
          <div style={{ color: 'white', paddingLeft: '20px' }}>
            <p style={{ cursor: 'pointer', marginBottom: '20px' }} onClick={() => navigate('/trips')}>Trips</p>
            <p style={{ cursor: 'pointer', marginBottom: '20px' }} onClick={() => navigate('/drivers')}>Drivers</p>
            <p style={{ cursor: 'pointer', marginBottom: '20px' }} onClick={() => navigate('/dayendreport')}>Day End Report</p>
            <p style={{ cursor: 'pointer', marginBottom: '20px', color: 'red' }} onClick={handleLogout}>Logout</p>
          </div>
        )}
      </div>

      {/* Hamburger Icon (Top Right) */}
      <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '30px', cursor: 'pointer', zIndex: 3 }}>
        <span onClick={() => setMenuOpen(!menuOpen)}>☰</span>
      </div>

      {/* Center Dashboard Content */}
      <div style={{ paddingTop: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
        <h2>Welcome Admin!</h2>

        {/* Cards Section */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>

          {/* Trips Card */}
          <div 
            onClick={() => navigate('/trips')}
            style={{
              width: '150px',
              height: '100px',
              backgroundColor: 'white',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '18px',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Trips
          </div>

          {/* Drivers Card */}
          <div 
            onClick={() => navigate('/drivers')}
            style={{
              width: '150px',
              height: '100px',
              backgroundColor: 'white',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '18px',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Drivers
          </div>

          {/* Day End Report Card */}
          <div 
            onClick={() => navigate('/dayendreport')}
            style={{
              width: '150px',
              height: '100px',
              backgroundColor: 'white',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '18px',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Day End Report
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
