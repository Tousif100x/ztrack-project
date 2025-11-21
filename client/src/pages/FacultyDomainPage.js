// client/src/pages/FacultyDomainPage.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // 1. Import Link
import Navbar from '../components/Navbar';
import courseApi from '../api/courseApi';
import './FacultyDomainPage.css';

function FacultyDomainPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const { domainId } = useParams();

  // Function to fetch courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await courseApi.getFacultyCourses(domainId);
      setCourses(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load your courses.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [domainId]);

  const { title, description } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      return setError('Please fill out all fields.');
    }
    setError('');

    try {
      const res = await courseApi.createCourse(domainId, { title, description });
      setCourses([...courses, res.data]);
      setFormData({ title: '', description: '' });
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create course.');
    }
  };
// ... (inside FacultyDomainPage, near your onSubmit) ...
const onDeleteCourse = async (courseId) => {
  if (window.confirm('Are you sure? This will delete the course and ALL its modules.')) {
    try {
      await courseApi.deleteCourse(courseId);
      // Filter out the deleted course from the state
      setCourses(courses.filter((course) => course._id !== courseId));
    } catch (err) {
      setError('Failed to delete course.');
    }
  }
};
  return (
    <>
      <Navbar />
      <div className="faculty-domain-container">
        <div className="form-section">
          {/* ... (your form is unchanged) ... */}
           <h2>Create New Course</h2>
          {error && <p className="faculty-error">{error}</p>}
          <form onSubmit={onSubmit} className="course-form">
            <div className="form-group">
              <label htmlFor="title">Course Title</label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Course Description</label>
              <textarea
                name="description"
                value={description}
                onChange={onChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="faculty-button">
              Create Course
            </button>
          </form>
        </div>

        <div className="list-section">
          <h2>Your Courses in this Domain</h2>
          <div className="course-list-faculty">
            {loading && <p>Loading courses...</p>}
            {!loading && courses.length === 0 && (
              <p>You have not created any courses in this domain yet.</p>
            )}
           {courses.map((course) => (
  <div key={course._id} className="course-card-faculty-wrapper">
    <Link 
      to={`/faculty/course-editor/${course._id}`} 
      className="course-card-faculty-link"
    >
      <div className="course-card-faculty">
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <span>&rarr; Add/Edit Modules</span>
      </div>
    </Link>
    {/* --- ADD THIS BUTTON --- */}
    <button 
      onClick={() => onDeleteCourse(course._id)}
      className="delete-button-course"
    >
      Delete Course
    </button>
  </div>
))}
          </div>
        </div>
      </div>
    </>
  );
}

export default FacultyDomainPage;