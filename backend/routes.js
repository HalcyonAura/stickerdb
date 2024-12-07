const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// In-memory database (temporary)
const images = [];

// Route to upload an image
router.post('/upload', upload.single('image'), (req, res) => {
  const { file } = req;
  const { metadata } = req.body;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imageData = {
    id: images.length + 1,
    src: `http://localhost:5000/uploads/${file.filename}`,
    metadata,
  };

  images.push(imageData);

  res.status(200).json(imageData);
});

// Route to fetch all images
router.get('/images', (req, res) => {
  res.json(images);
});

module.exports = router;