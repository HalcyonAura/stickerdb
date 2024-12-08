// BRAND NEW, staging for AWS

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Check if the uploads folder exists, create it if not
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory where files are saved
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
// USE INSTEAD?
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       const uploadDir = './uploads';
//       if (!fs.existsSync(uploadDir)) {
//         fs.mkdirSync(uploadDir);
//       }
//       cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//       cb(null, `${Date.now()}-${file.originalname}`);
//     },
//   });

// File filter (optional, restrict to images only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG and PNG files are allowed"), false);
  }
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit: 2MB
});

const saveFile = (file) => {
    const filePath = `/uploads/${file.filename}`;
    return {
      size: file.size,
      name: file.originalname,
      path: filePath,
      url: filePath, // For local, path is the URL. Replace with S3 URL later.
    };
  };

module.exports = { upload, saveFile };