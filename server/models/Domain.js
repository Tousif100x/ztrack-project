// server/models/Domain.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DomainSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true, // We only want one "Fullstack", etc.
  },
  introduction: {
    type: String,
    required: true,
  },
  roadmap: {
    type: String, // Can store text, Markdown, or a URL to an image
    required: true,
  },
});

module.exports = mongoose.model('Domain', DomainSchema);