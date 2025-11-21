// server/routes/domains.js

const express = require('express');
const router = express.Router();
// Import both functions
const { 
  getAllDomains, 
  getDomainById 
} = require('../controllers/domainController');

// @route   GET /api/domains
// @desc    Get all domains
router.get('/', getAllDomains);

// @route   GET /api/domains/:id
// @desc    Get a single domain by ID
router.get('/:id', getDomainById); // <-- ADD THIS NEW ROUTE

module.exports = router;