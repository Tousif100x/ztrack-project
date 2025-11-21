// client/src/pages/AuthPage.js

import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import authApi from '../api/authApi';
import './AuthPage.css'; // We'll create this next

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // Toggles between Login/Register
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  
  // 1. Get the role from the URL (e.g., "?role=student")
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');
  
  const navigate = useNavigate();

  const { name, email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      let res;
      if (isLogin) {
        // --- LOGIN LOGIC ---
        res = await authApi.login(email, password);
      } else {
        // --- REGISTER LOGIC ---
        if (!name) {
          setError('Name is required for registration');
          return;
        }
        res = await authApi.register(name, email, password, role);
      }
      
      // If successful, we get a token back
      const token = res.data.token;
      
     authApi.saveToken(token);
      console.log('Login/Register Successful! Token:', token);

      // 2. Redirect based on role
      if (role === 'student') {
        navigate('/dashboard/student');
      } else if (role === 'faculty') {
        navigate('/dashboard/faculty');
      }

    } catch (err) {
      // Get error message from backend
      setError(err.response.data.msg || 'Something went wrong');
    }
  };

  // Capitalize the first letter of the role for display
  const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : '';

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">
          {isLogin ? 'Login' : 'Register'} as {displayRole}
        </h2>
        
        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={onSubmit}>
          {/* --- Show "Name" field only for Register --- */}
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={onChange}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={onChange}
              required
              minLength="6"
            />
          </div>

          <button type="submit" className="auth-button">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-toggle">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;