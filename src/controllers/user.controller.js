import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser=asyncHandler(async (req,res)=>{
   // 1. user details 
   const {fullName,email,username,password}=req.body
   console.log("email:", email);
  
   //2.validation(not empty) 
   if(fullName===""){ throw new ApiError(400,"fullname is required")}
   if(email===""){ throw new ApiError(400,"fullname is required")}
   if(username===""){ throw new ApiError(400,"fullname is required")}
   if(password===""){ throw new ApiError(400,"fullname is required")}
   
   //3.check already exist(username,email)
   // const existedUsername=User.findOne({
   //     $or:[{username},{email}]
   // })
   const existedUsername=User.findOne({username});
   const existedEmail=User.findOne({email});
   if(existedEmail){throw new ApiError(409,"User with email already exists")}
    if(existedUsername){throw new ApiError(409,"User with username already exists")}
   //4.check for images and avatar 
  const avatarLocalPath= req.files?.avatar[0]?.path;
  const coverImageLocalPath= req.files?.coverImage[0]?.path;
  if(!avatarLocalPath){throw new ApiError(400,"Avatar file is required")}

   //5.upload to cloudinary
   const avatar=await uploadOnCloudinary(avatarLocalPath)
   const coverImage=await uploadOnCloudinary(coverImageLocalPath)
   if(!avatar){throw new ApiError(400,"Avatar file is required")}
   // 6.create userand entry in db
   const user=User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url||"",
    email,
    password,
    username : username.toLowerCase()

   })
   const createdUser= await User.findById(user._id).select(
    "-password -refreshToken"
   )
   if(!createdUser){throw new ApiError(500,"somethingwent wrong in creating user")}
   return res.status(201).json(new ApiResponse(200,createdUser,"User registered sucessfully"))
   //remove password and refresh token field fron response
   //check for user creation
   //return res


})

export {registerUser}