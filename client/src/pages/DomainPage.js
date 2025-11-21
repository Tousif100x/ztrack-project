// client/src/pages/DomainPage.js

import React, { useState, useEffect } from 'react';
// 1. Import useNavigate
import { useParams, useNavigate } from 'react-router-dom'; 
import Navbar from '../components/Navbar';
import domainApi from '../api/domainApi';
import courseApi from '../api/courseApi';
import enrollmentApi from '../api/enrollmentApi'; // 2. Import enrollmentApi
import './DomainPage.css';

function DomainPage() {
  const [domain, setDomain] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { domainId } = useParams();
  const navigate = useNavigate(); // 3. Get the navigate function

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const domainRes = await domainApi.getDomain(domainId);
        const coursesRes = await courseApi.getCoursesByDomain(domainId);
        setDomain(domainRes.data);
        setCourses(coursesRes.data);
      } catch (err) {
        setError('Failed to load data. Please go back and try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [domainId]);

  // 4. Create the enrollment handler
  const handleEnrollAndPlay = async (courseId) => {
    try {
      // First, call the API to enroll
      await enrollmentApi.enrollInCourse(courseId);
      // If successful, navigate to the player
      navigate(`/course-player/${courseId}`);
    } catch (err) {
      setError('Failed to enroll in course. Please try again.');
      console.error(err);
    }
  };

  if (loading) {
    // This block is now correct
    return (
      <>
        <Navbar />
        <div className="domain-container">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  if (error && !domain) { // Only show full error page if data failed
    // This block is now correct
    return (
      <>
        <Navbar />
        <div className="domain-container">
          <p className="domain-error">{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="domain-container">
        {domain && (
          // This block is now correct
          <div className="domain-header">
            <h1>{domain.name}</h1>
            <p className="domain-intro">{domain.introduction}</p>
          </div>
        )}

        <div className="domain-content">
          <div className="roadmap-section">
            {/* This block is now correct */}
            <h2>Your Roadmap</h2>
            <pre className="roadmap-text">{domain?.roadmap}</pre>
          </div>

          <div className="courses-section">
            <h2>Available Courses</h2>
            {/* Show enrollment error here, if one occurred */}
            {error && <p className="domain-error">{error}</p>}
            <div className="course-list">
              {courses.length > 0 ? (
                courses.map((course) => (
                  // 5. Change this from a <Link> to a <div> with an onClick
                  <div 
                    key={course._id} 
                    className="course-card-domain course-card-domain-link" // Add link class
                    onClick={() => handleEnrollAndPlay(course._id)}
                  >
                    <div className="course-card-domain-content">
                      <h3>{course.title}</h3>
                      <p>{course.description.substring(0, 150)}...</p>
                      <span>By {course.facultyId.name}</span>
                      <span className="enroll-button">Start Learning &rarr;</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No courses available in this domain yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DomainPage;