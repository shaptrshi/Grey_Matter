const multer = require("multer");
const path = require("path");

// Store files in memory instead of disk since we'll upload directly to Cloudinary
const storage = multer.memoryStorage();

// File filter to accept only images (expanded to include more common formats)
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif|webp|svg/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only images (jpeg, jpg, png, gif, webp, svg) are allowed!"));
  }
};

// Upload middleware
const upload = multer({
  storage,
  limits: { 
    fileSize: 50 * 1024 * 1024, // Limit file size to 50MB
    files: 1 // Limit to single file uploads
  },
  fileFilter,
});

module.exports = upload;