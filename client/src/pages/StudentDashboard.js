// client/src/pages/StudentDashboard.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar'; // Import the Navbar
import './Dashboard.css'; // A shared CSS file

function StudentDashboard() {
  const [domains, setDomains] = useState([]); // To store our 5 domains
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // This function runs once when the page loads
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        // Fetch data from our backend API
        const res = await axios.get('/api/domains');
        setDomains(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load domains. Please try again.');
        setLoading(false);
      }
    };

    fetchDomains();
  }, []); // The empty array [] means "run only once"

  return (
    <>
      <Navbar /> {/* Add the navbar */}
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Student Dashboard</h1>
          <p>Choose a domain to start your learning journey.</p>
        </div>

        {loading && <p>Loading domains...</p>}
        {error && <p className="dashboard-error">{error}</p>}

        <div className="domain-grid">
          {domains.map((domain) => (
            <Link
              to={`/domain/${domain._id}`} // Will link to the DomainPage
              key={domain._id}
              className="domain-card"
            >
              <h3>{domain.name}</h3>
              <p>{domain.introduction.substring(0, 100)}...</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;