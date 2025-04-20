// middleware/errorHandler.js
import { ApiError } from "../utils/apiError.js";
export const errorHandler = (err, req, res, next) => {
   if (err instanceof ApiError) {
     return res.status(err.statusCode).json({
       statusCode: err.statusCode,
       message: err.message,
       success: err.success,
       errors: err.errors,
       data: err.data,
     });
   }
 
   // Fallback for unexpected errors
   console.error('Unexpected error:', err.stack);
   return res.status(500).json({
     statusCode: 500,
     message: 'Something went wrong on the server',
     success: false,
     errors: [],
     data: null,
   });
 };