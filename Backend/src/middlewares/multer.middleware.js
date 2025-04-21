import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ApiError } from '../utils/apiError.js';

const uploadDir = 'src/Uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only PDF files are allowed!', [], false), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
  { name: 'resume', maxCount: 1 },
  { name: 'jobId', maxCount: 1 },
  { name: 'name', maxCount: 1 },
  { name: 'email', maxCount: 1 },
  { name: 'phone', maxCount: 1 },
  { name: 'experience', maxCount: 1 },
  { name: 'currentSalary', maxCount: 1 },
  { name: 'expectedSalary', maxCount: 1 },
  { name: 'currentCompany', maxCount: 1 },
]);

const multerMiddleware = (req, res, next) => {
  console.log('Multer middleware: Raw headers:', req.headers);
  upload(req, res, (err) => {
    console.log('Multer middleware: Processed:', { body: req.body, files: req.files });
    if (err instanceof multer.MulterError) {
      console.error('Multer Error:', err.message);
      return next(new ApiError(400, `Multer error: ${err.message}`, [], false));
    } else if (err) {
      console.error('Upload Error:', err.message);
      return next(err);
    }
    if (!req.body || !req.files || !req.files.resume) {
      console.error('Multer failed to parse form data');
      return next(new ApiError(400, 'Failed to parse form data', [], false));
    }
    next();
  });
};

export { multerMiddleware };