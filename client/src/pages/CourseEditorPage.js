// client/src/pages/CourseEditorPage.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import Link
import Navbar from '../components/Navbar';
import moduleApi from '../api/moduleApi';
import './CourseEditorPage.css';

function CourseEditorPage() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state
  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState('video');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { courseId } = useParams();

  // Fetch existing modules for this course
  const fetchModules = async () => {
    try {
      setLoading(true);
      const res = await moduleApi.getModules(courseId);
      setModules(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load modules.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [courseId]); // Re-run if courseId changes

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Get the first file
  };

  // Handle the form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title || !file) {
      return setError('Please provide a title and a file.');
    }
    setError('');
    setUploading(true);

    // 1. Create FormData object
    const formData = new FormData();
    formData.append('title', title);
    formData.append('contentType', contentType);
    formData.append('file', file); // 'file' must match backend (upload.single('file'))

    try {
      // 2. Call the API
      const res = await moduleApi.addModule(courseId, formData);
      
      // 3. Update UI
      setModules([...modules, res.data]); // Add new module to list
      
      // 4. Clear form
      setTitle('');
      setContentType('video');
      setFile(null);
      e.target.reset(); // Reset the file input
    } catch (err) {
      setError(err.response?.data?.msg || 'Upload failed. File may be too large or wrong type.');
    } finally {
      setUploading(false);
    }
  };

  // Handle deleting a module
  const onDeleteModule = async (moduleId) => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      try {
        await moduleApi.deleteModule(moduleId);
        // Filter out the deleted module from the state
        setModules(modules.filter((mod) => mod._id !== moduleId));
      } catch (err) {
        setError('Failed to delete module.');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="editor-container">
        <div className="editor-header">
          <h1>Course Editor</h1>
          {/* We need the domainId to make this link work,
              which we'd need to pass via props or another API call.
              For now, it's a placeholder. */}
          {/* <Link to={`/dashboard/faculty/domain/DOMAIN_ID_HERE`}>
            &larr; Back to Domain
          </Link> */}
        </div>

        <div className="editor-content">
          <div className="editor-form-section">
            <h2>Add New Module</h2>
            {error && <p className="editor-error">{error}</p>}
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label htmlFor="title">Module Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="contentType">Content Type</label>
                <select
                  id="contentType"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                >
                  <option value="video">Video (mp4)</option>
                  <option value="note">Note (pdf)</option>
                  <option value="assignment">Assignment (pdf/jpg)</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="file">Upload File</label>
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <button type="submit" className="editor-button" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Add Module'}
              </button>
            </form>
          </div>

          <div className="editor-list-section">
            <h2>Course Modules</h2>
            <div className="module-list">
              {loading && <p>Loading modules...</p>}
              {!loading && modules.length === 0 && <p>No modules added yet.</p>}
              {modules.map((mod) => (
                <div key={mod._id} className="module-item">
                  
                  {/* Show a link to grading page for assignments */}
                  {mod.contentType === 'assignment' ? (
                    <Link to={`/faculty/grade/${courseId}/${mod._id}`} className="module-title-link">
                      ✍️ {mod.title} ({mod.contentType}) - View Submissions
                    </Link>
                  ) : (
                    // Otherwise, just show text
                    <span>
                      {mod.contentType === 'video' ? '▶️' : '📄'} {mod.title} ({mod.contentType})
                    </span>
                  )}
                  
                  <div className="module-item-actions">
                    <a href={mod.url} target="_blank" rel="noopener noreferrer">
                      View File
                    </a>
                    <button 
                      onClick={() => onDeleteModule(mod._id)} 
                      className="delete-button-module"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseEditorPage;