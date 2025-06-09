import React from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css'; // Optional for external styling

export default function Welcome() {
  return (
    <div className="welcome-container">
      <div className="logo-container">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Font_Awesome_5_solid_car.svg/512px-Font_Awesome_5_solid_car.svg.png"
          alt="JustRide Logo"
          className="logo"
        />
        <h1 className="title">JustRide</h1>
      </div>
      <Link to="/login" className="login-button">Get Started</Link>
    </div>
  );
}
