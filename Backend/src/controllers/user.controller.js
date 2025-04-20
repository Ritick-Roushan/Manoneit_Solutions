import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/apiResponse.js"
import jwt from "jsonwebtoken";


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
    // get user details from fronted
    // validation -- not empty
    // check if user already exists : username, email
    // create user object - create entry in db
    // remove password and refresh token field from  response
    // check for user creation 
    // return response
  
    const { fullname, email, contactnumber, companyname, role, password } = req.body
    // console.log("email: ", email);
  
    //    if(fullname === ""){
    //     throw new ApiError(400, "full name is required")
    //    }
  
    if (
      [fullname, email, contactnumber, role, password].some(field => field?.trim() === "")
    ) {
      throw new ApiError(400, "All fields are required");
    }
  
  
    const existedUser = await User.findOne({ email });
  
    if (existedUser) {
      throw new ApiError(409, "User with this email or username already exists")
    }
  
    // console.log(req.files)
  
  const userData = {
    fullname,
    contactnumber,
    email,
    role,
    password
  };
  
  if (companyname?.trim()) {
    userData.companyname = companyname;
  }

  const user = await User.create(userData);
  
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    )
  
    if (!createdUser) {
      throw new ApiError(500, "something went wrong while registering the user")
    }
    return res.status(201).json(
      new ApiResponse(200, createdUser, "user registered successfully")
    )
  
  })  


  const loginUser = asyncHandler(async (req, res) => {
    //get data from req body
    //username or email
    //find the user
    //password check
    //access and refresh token
    //send cookie
  
    const { email,  password } = req.body
  
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

