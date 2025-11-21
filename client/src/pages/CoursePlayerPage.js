// client/src/pages/CoursePlayerPage.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import moduleApi from '../api/moduleApi';
import enrollmentApi from '../api/enrollmentApi';
import certificateApi from '../api/certificateApi';
import submissionApi from '../api/submissionApi';
import './CoursePlayerPage.css'; // Make sure this file exists

function CoursePlayerPage() {
  const [modules, setModules] = useState([]);
  const [currentModule, setCurrentModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrollment, setEnrollment] = useState(null);
  
  const [submissions, setSubmissions] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  const { courseId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [modulesRes, enrollmentRes, submissionsRes] = await Promise.all([
          moduleApi.getModules(courseId),
          enrollmentApi.getEnrollmentDetails(courseId),
          submissionApi.getMySubmissions(courseId)
        ]);

        setModules(modulesRes.data);
        setEnrollment(enrollmentRes.data);
        setSubmissions(submissionsRes.data);

        if (modulesRes.data.length > 0) {
          setCurrentModule(modulesRes.data[0]);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load course content.');
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  useEffect(() => {
    setFile(null);
    setUploadError('');
    setUploadSuccess('');
  }, [currentModule]);

  // --- HANDLERS (NOW DEFINED CORRECTLY) ---
  const handleMarkComplete = async () => {
    if (!currentModule) return;
    try {
      const res = await enrollmentApi.markModuleComplete(currentModule._id);
      setEnrollment(res.data);
    } catch (err) {
      alert('Error updating progress. Please try again.');
    }
  };

  const handleGenerateCertificate = async () => {
    try {
      const res = await certificateApi.generateCertificate(courseId);
      const url = res.data.url;
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'certificate.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert(err.response?.data?.msg || 'Error generating certificate. Please try again.');
      console.error(err);
    }
  };

  const isModuleCompleted = (moduleId) => {
    return enrollment?.completedModules?.includes(moduleId);
  };

  // --- SUBMISSION HANDLERS (Unchanged) ---
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      return setUploadError('Please select a file to submit.');
    }
    setUploadError('');
    setUploadSuccess('');
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await submissionApi.submitAssignment(currentModule._id, formData);
      setSubmissions([...submissions, res.data]);
      setUploading(false);
      setUploadSuccess('Assignment submitted successfully! Awaiting grade.');
      setFile(null);
      e.target.reset();
    } catch (err) {
      setUploading(false);
      setUploadError('Upload failed. Please try again.');
    }
  };

  // --- RENDER CONTENT (FIXED) ---
  const renderContent = () => {
    if (!currentModule) {
      if (modules.length === 0 && !loading) {
        return <p>This course has no content yet. Please check back later.</p>;
      }
      return <p>Please select a module to begin.</p>;
    }
    if (!currentModule.url) {
      return <p>Error: This module has no content URL.</p>;
    }

    switch (currentModule.contentType) {
      // --- THIS IS THE FIX ---
      case 'video':
        return (
          <div className="player-video-wrapper">
            <video key={currentModule._id} controls className="player-video" autoPlay>
              <source src={currentModule.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case 'note':
        return (
          <div className="player-document-wrapper">
            <iframe
              key={currentModule._id}
              src={currentModule.url}
              title={currentModule.title}
              className="player-document"
              frameBorder="0"
            ></iframe>
          </div>
        );
      // --- END OF FIX ---
        
      case 'assignment':
        const mySubmission = submissions.find(s => s.moduleId === currentModule._id);
        return (
          <div className="assignment-wrapper">
            <h3>Assignment: {currentModule.title}</h3>
            <p>Please download the assignment instructions and submit your completed work below.</p>
            <a href={currentModule.url} target="_blank" rel="noopener noreferrer" className="assignment-download-link">
              Download Assignment (PDF/Image)
            </a>

            {mySubmission ? (
              <div className="submission-status-box">
                <h4>Your Submission Status</h4>
                <p>Status: <span className={mySubmission.status}>{mySubmission.status}</span></p>
                <p>Grade: <strong>{mySubmission.grade}</strong></p>
                <a href={mySubmission.fileUrl} target="_blank" rel="noopener noreferrer">View Your Submission</a>
              </div>
            ) : (
              <form onSubmit={handleAssignmentSubmit} className="submission-form">
                <label htmlFor="assignmentFile">Upload Your Submission</label>
                <input 
                  type="file" 
                  id="assignmentFile" 
                  onChange={handleFileChange} 
                  accept=".pdf,.png,.jpg,.jpeg"
                />
                <button type="submit" className="submission-button" disabled={uploading}>
                  {uploading ? 'Submitting...' : 'Submit Assignment'}
                </button>
                {uploadError && <p className="submission-error">{uploadError}</p>}
                {uploadSuccess && <p className="submission-success">{uploadSuccess}</p>}
              </form>
            )}
          </div>
        );

      default:
        return <p>Unsupported content type.</p>;
    }
  };

  // --- RENDER SIDEBAR (Unchanged) ---
  const renderSidebarIcon = (mod) => {
    if (mod.contentType === 'assignment') {
      const mySubmission = submissions.find(s => s.moduleId === mod._id);
      if (mySubmission?.grade === 'Pass') return '✅';
      if (mySubmission) return '⌛';
      return '✍️';
    }
    if (isModuleCompleted(mod._id)) return '✅';
    if (mod.contentType === 'video') return '▶️';
    if (mod.contentType === 'note') return '📄';
    return '📄';
  };

  // --- RENDER MODULE ACTIONS (NOW DEFINED CORRECTLY) ---
  const renderModuleActions = () => {
    if (!currentModule || currentModule.contentType === 'assignment') {
      return null;
    }
    return (
      <button
        onClick={handleMarkComplete}
        disabled={isModuleCompleted(currentModule?._id)}
        className="complete-button"
      >
        {isModuleCompleted(currentModule?._id) ? 'Completed!' : 'Mark as Complete'}
      </button>
    );
  };

  // --- RETURN (Unchanged) ---
  return (
    <>
      <Navbar />
      <div className="player-container">
        <div className="player-sidebar">
          <h3>Course Content</h3>
          <div className="progress-bar-container">
             <div 
              className="progress-bar" 
              style={{ width: `${enrollment?.progress || 0}%` }}
            ></div>
          </div>
          <span className="progress-text">{Math.round(enrollment?.progress || 0)}% Complete</span>
          <ul>
            {modules.map((mod) => (
              <li
                key={mod._id}
                className={`
                  ${currentModule?._id === mod._id ? 'active' : ''}
                  ${mod.contentType !== 'assignment' && isModuleCompleted(mod._id) ? 'completed' : ''}
                `}
                onClick={() => setCurrentModule(mod)}
              >
                {renderSidebarIcon(mod)}
                {mod.title}
              </li>
            ))}
          </ul>
        </div>
        <div className="player-main">
          {loading ? (
            <p>Loading content...</p>
          ) : (
            <>
              <h2>{currentModule?.title}</h2>
              {renderContent()}

              <div className="module-actions">
                {renderModuleActions()}
                {enrollment?.isCompleted && (
                  <button 
                    className="certificate-button"
                    onClick={handleGenerateCertificate}
                  >
                    Generate Certificate
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default CoursePlayerPage;