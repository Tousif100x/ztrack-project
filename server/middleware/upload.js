// server/middleware/upload.js

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ztrack-uploads', // A folder name in your Cloudinary account
    resource_type: 'auto', // Automatically detect file type (video, raw)
    allowed_formats: ['mp4', 'pdf', 'jpg', 'png'],
  },
});

// Create the upload middleware
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB file size limit
});

module.exports = upload;