// server/server.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

// --- Import Routes ---
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const domainRoutes = require('./routes/domains'); // Import our new auth routes
const courseRoutes = require('./routes/courses');
const moduleRoutes = require('./routes/module');
const enrollmentRoutes = require('./routes/enrollment');
const certificateRoutes = require('./routes/certificate');
const submissionRoutes = require('./routes/submission');
// 1. Create the Express app
const app = express();

// --- NEW: Add Middleware ---
// This teaches our server to understand JSON from request bodies
app.use(express.json());

// 2. Connect to MongoDB
const dbURI = 'mongodb://localhost:27017/ztrack';
mongoose.connect(dbURI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// 3. Define a Port
const PORT = 5000;

// --- NEW: Use the Routes ---
// Tell Express to use our auth routes when the URL starts with /api/auth
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/domains', domainRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/submissions', submissionRoutes);

// 4. Create a basic "test" route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// 5. Start the server and make it LISTEN
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});