import { asyncHandler } from '../utils/asynchandler.js';
import { ApiError } from '../utils/apiError.js';
import { OtpVerification } from '../models/userotp.model.js';
import { User } from '../models/user.model.js';
import { sendEmail } from '../utils/sendEmail.js'; // ensure this matches the actual file name
import crypto from 'crypto';

// OTP expiry time (5 minutes)
const OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes in milliseconds

// Function to generate a secure OTP code
const generateOtpCode = () => {
  const otpLength = 6; // OTP length (6 digits)
  const otp = crypto.randomBytes(3).toString('hex').slice(0, otpLength); // Generate a 6-character OTP
  return otp;
};

// Controller for generating OTP
export const generateOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      throw new ApiError(400, "Email is required");
    }
  
    // Check if an OTP entry already exists, if so, update it
    let otpEntry = await OtpVerification.findOne({ email });
    const otpCode = generateOtpCode(); // Generate OTP
    const expiryTime = new Date(Date.now() + OTP_EXPIRY); // OTP expiry time
  
    if (otpEntry) {
      otpEntry.otp = otpCode;
      otpEntry.expiresAt = expiryTime;
      await otpEntry.save();
    } else {
      otpEntry = new OtpVerification({
        email,
        otp: otpCode,
        expiresAt: expiryTime,
      });
      await otpEntry.save();
    }
  
    // Send OTP to the user's email
    const subject = "Your OTP Code";
    const text = `Your OTP code is: ${otpCode}. It is valid for 5 minutes.`;
    
    try {
      await sendEmail({
        to: email,
        subject,
        text,  // Include OTP in the email body
      });
      return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      throw new ApiError(500, "Failed to send OTP email");
    }
  });
  