// server/controllers/domainController.js

const Domain = require('../models/Domain');

// @desc    Get all domains
// @access  Public
exports.getAllDomains = async (req, res) => {
  try {
    // Find all documents in the 'domains' collection
    const domains = await Domain.find();
    res.json(domains);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// ... your getAllDomains function is up here ...

// @desc    Get a single domain by its ID
// @access  Public
exports.getDomainById = async (req, res) => {
  try {
    const domain = await Domain.findById(req.params.id);

    if (!domain) {
      return res.status(404).json({ msg: 'Domain not found' });
    }

    res.json(domain);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};