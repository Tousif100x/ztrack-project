// client/src/components/Navbar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authApi from '../api/authApi';
import './Navbar.css'; // We'll create this next

function Navbar() {
  const navigate = useNavigate();

  const onLogout = () => {
    authApi.logout(); // Clear the token
    navigate('/'); // Redirect to homepage
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard/student" className="navbar-logo">
          ztrack
        </Link>

        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/dashboard/student" className="navbar-link">
              Dashboard
            </Link>
          </li>
          <li className="navbar-item">
            {/* TODO: Add Profile Dropdown here */}
            <span className="navbar-link" onClick={onLogout}>
              Logout
            </span>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;