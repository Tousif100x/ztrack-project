// client/src/pages/FacultySubmissionsPage.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import submissionApi from '../api/submissionApi';
import './FacultySubmissionsPage.css'; // We'll create this next

function FacultySubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [grade, setGrade] = useState('Pass'); // Default grade

  const { moduleId, courseId } = useParams(); // Get both IDs from URL

  // Function to fetch submissions
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await submissionApi.getSubmissionsForAssignment(moduleId);
      setSubmissions(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load submissions.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [moduleId]);

  // Handle the grading
  const handleGrade = async (submissionId) => {
    if (!grade) return;
    try {
      await submissionApi.gradeSubmission(submissionId, grade);
      // Refresh the list to show the new grade
      fetchSubmissions();
    } catch (err) {
      alert('Failed to submit grade.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="submissions-container">
        <div className="submissions-header">
          <h1>Grade Submissions</h1>
          <Link to={`/faculty/course-editor/${courseId}`}>
            &larr; Back to Course Editor
          </Link>
        </div>

        {loading && <p>Loading submissions...</p>}
        {error && <p className="submission-error-page">{error}</p>}
        
        <div className="submissions-list">
          {!loading && submissions.length === 0 && (
            <p>No students have submitted this assignment yet.</p>
          )}

          {submissions.map((sub) => (
            <div key={sub._id} className="submission-card">
              <h4>{sub.studentId.name}</h4>
              <p>Email: {sub.studentId.email}</p>
              <p>Status: <span className={sub.status}>{sub.status}</span></p>
              <p>Current Grade: <strong>{sub.grade}</strong></p>
              
              <a 
                href={sub.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="submission-download-link"
              >
                View Student's Submission
              </a>

              <div className="grading-form">
                <select onChange={(e) => setGrade(e.target.value)} defaultValue="Pass">
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                </select>
                <button onClick={() => handleGrade(sub._id)}>Submit Grade</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default FacultySubmissionsPage;