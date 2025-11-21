// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import StudentDashboard from './pages/StudentDashboard';
import DomainPage from './pages/DomainPage';
import FacultyDashboard from './pages/FacultyDashboard';
import FacultyDomainPage from './pages/FacultyDomainPage';
import CourseEditorPage from './pages/CourseEditorPage'; // 1. Import it
import CoursePlayerPage from './pages/CoursePlayerPage';
import FacultySubmissionsPage from './pages/FacultySubmissionsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Student Routes */}
        <Route path="/dashboard/student" element={<StudentDashboard />} />
        <Route path="/domain/:domainId" element={<DomainPage />} />
        <Route path="/course-player/:courseId" element={<CoursePlayerPage />} /> {/* 2. Add this line */}
        {/* Faculty Routes */}
        <Route path="/dashboard/faculty" element={<FacultyDashboard />} />
        <Route path="/dashboard/faculty/domain/:domainId" element={<FacultyDomainPage />} />
        <Route path="/faculty/course-editor/:courseId" element={<CourseEditorPage />} /> {/* 2. Add this line */}
        <Route 
          path="/faculty/grade/:courseId/:moduleId" 
          element={<FacultySubmissionsPage />} 
        />
      </Routes>
    </Router>
  );
}

export default App;