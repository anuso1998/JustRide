import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div style={{ minHeight: '100vh', padding: '50px', backgroundColor: '#f0f2f5' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Welcome Admin</h2>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>
        {/* Trips */}
        <div 
          onClick={() => navigate('/trips')}
          style={{
            padding: '30px',
            backgroundColor: 'white',
            borderRadius: '10px',
            width: '200px',
            textAlign: 'center',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <h3>Trips</h3>
        </div>

        {/* Drivers */}
        <div 
          onClick={() => navigate('/drivers')}
          style={{
            padding: '30px',
            backgroundColor: 'white',
            borderRadius: '10px',
            width: '200px',
            textAlign: 'center',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <h3>Drivers</h3>
        </div>

        {/* Day End Report */}
        <div 
          onClick={() => navigate('/dayendreport')}
          style={{
            padding: '30px',
            backgroundColor: 'white',
            borderRadius: '10px',
            width: '200px',
            textAlign: 'center',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <h3>Day End Report</h3>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <button 
          onClick={handleLogout}
          style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
