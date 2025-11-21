// client/src/pages/FacultyDashboard.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar'; // Re-using the same Navbar
import './Dashboard.css'; // Re-using the same shared CSS

function FacultyDashboard() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const res = await axios.get('/api/domains'); // Same API call
        setDomains(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load domains. Please try again.');
        setLoading(false);
      }
    };

    fetchDomains();
  }, []);

  return (
    <>
      <Navbar /> {/* We'll update the links in Navbar later */}
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Faculty Dashboard</h1>
          <p>Choose a domain to manage your courses.</p>
        </div>

        {loading && <p>Loading domains...</p>}
        {error && <p className="dashboard-error">{error}</p>}

        <div className="domain-grid">
          {domains.map((domain) => (
            <Link
              // This is the new link for faculty
              to={`/dashboard/faculty/domain/${domain._id}`}
              key={domain._id}
              className="domain-card"
            >
              <h3>{domain.name}</h3>
              <p>Manage courses for {domain.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default FacultyDashboard;