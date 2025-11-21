// client/src/pages/HomePage.js

import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // We will create this CSS file next

function HomePage() {
  return (
    <div className="homepage-container">
      <div className="role-selector">
        <h1>Welcome to ztrack!</h1>
        <h2>Are you a...</h2>
        <div className="options-container">
          <Link to="/auth?role=student" className="option-box student-box">
            <span>🎓</span>
            <h3>Student</h3>
          </Link>
          <Link to="/auth?role=faculty" className="option-box faculty-box">
            <span>👩‍🏫</span>
            <h3>Faculty</h3>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;