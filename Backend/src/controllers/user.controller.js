import { asyncHandler } from '../utils/asynchandler.js';
import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/apiResponse.js"
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { OtpVerification } from '../models/userotp.model.js';
import { sendEmail } from '../utils/sendEmail.js';


const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }


  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access and refresh token")
  }
}


const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, contactnumber, companyname, role, password, otp} = req.body;

  // Validation: all required fields
  if ([fullname, email, contactnumber, role, password, otp].some(field => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // if (role === "admin") {
  //   throw new ApiError(403, "Admin registration is not allowed");
  // }

  // Check if user already exists
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // Check if OTP exists
  const otpRecord = await OtpVerification.findOne({ email });
  if (!otpRecord) {
    throw new ApiError(400, "OTP not found. Please request a new one.");
  }

  // Validate OTP expiration
  const currentTime = new Date();
  if (new Date(otpRecord.expiresAt) < currentTime) {
    throw new ApiError(400, "OTP has expired. Please request a new one.");
  }

  // Validate OTP match
  const submittedOtp = otp.trim().toLowerCase();
  const storedOtp = otpRecord.otp.trim().toLowerCase();

  if (submittedOtp !== storedOtp) {
    throw new ApiError(400, "Invalid OTP. Please try again.");
  }

  // OTP is valid - delete the record
  await OtpVerification.deleteOne({ email });

  // Build user payload
  const userData = {
    fullname,
    email,
    contactnumber,
    role,
    password,
  };

  if (companyname?.trim()) {
    userData.companyname = companyname;
  }

  // Create user
  const user = await User.create(userData);

  // Select only safe fields to return
  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});


const loginUser = asyncHandler(async (req, res) => {
  //get data from req body
  //username or email
  //find the user
  //password check
  //access and refresh token
  //send cookie

  const { email, password } = req.body

  if (!email) {
    throw new ApiError(400, "username or email is required")
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "user does not exist")
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    throw new ApiError(401, "Enter valid password")
  }


  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

  const loggedInUser = await User.findById(user._id).select("-password  -refreshToken")

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser, accessToken, refreshToken
        },
        "User logged In Successfully"
      )
    )



})

// const logoutUser = asyncHandler(async (req, res) => {
//   await User.findByIdAndUpdate(
//     req.user._id,
//     {
//       $unset: {
//         refreshToken: 1 // this remove the field document
//       }
//     },
//     {
//       new: true
//     }
//   )

//   const options = {
//     httpOnly: true,
//     secure: true
//   }


//   return res
//     .status(200)
//     .clearCookie("accessToken", options)
//     .clearCookie("refreshToken", options)
//     .json(new ApiResponse(200, {}, "User logged out"))
// })

const logoutUser = asyncHandler(async (req, res) => {
  // Make sure to verify if the user is authenticated
  if (!req.cookies.accessToken) {
    return res.status(401).json({ message: 'Unauthorized request' });
  }

  // Your logout logic here (usually removing or invalidating the token)
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 } // Remove refreshToken from the user
    },
    { new: true }
  );

  // Clear cookies for accessToken and refreshToken
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',  // Ensure this matches the environment
    sameSite: 'Strict',  // Or 'Lax', depending on your setup
  };

  res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ message: "Logged out successfully" });
});

const getUserStats = asyncHandler(async (req, res) => {
  const user = req.user;

  // Restrict to admins
  if (!user || user.role !== 'admin') {
    throw new ApiError(403, 'Only admins can access user stats');
  }

  // Count users by role
  const totalUsers = await User.countDocuments();
  const clients = await User.countDocuments({ role: 'company' });
  const candidates = await User.countDocuments({ role: 'candidate' });

  //console.log('User stats:', { totalUsers, clients, candidates });

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      clients,
      candidates,
    },
  });
});




const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request")
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id)

    if (!user) {
      throw new ApiError(401, "invalid Refresh Token")
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired")
    }

    const options = {
      httpOnly: true,
      secure: true
    }

    const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id)

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(new ApiResponse(200, { accessToken, newRefreshToken }, "Access token refreshed succussfully"))
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token")
  }

})

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body

  const user = await User.findById(req.user?._id)

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password")
  }
  user.password = newPassword
  await user.save({ validateBeforeSave: false })

  return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"))


})

export { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getUserStats }

