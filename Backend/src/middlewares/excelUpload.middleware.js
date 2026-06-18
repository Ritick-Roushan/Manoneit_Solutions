import multer from "multer";
import { ApiError } from "../utils/apiError.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        400,
        "Only Excel files are allowed"
      ),
      false
    );
  }
};

const excelUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
}).single("file");

export const excelUploadMiddleware = (
  req,
  res,
  next
) => {
  excelUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return next(
        new ApiError(
          400,
          err.message
        )
      );
    }

    if (err) {
      return next(err);
    }

    if (!req.file) {
      return next(
        new ApiError(
          400,
          "Excel file is required"
        )
      );
    }

    next();
  });
};