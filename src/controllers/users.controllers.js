import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResoponse } from "../utils/ApiResponse.js"; 
import { User } from "../models/users.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler( async( req, res) => {

    const { fullName, email, username, password} = req.body

    if(
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser) {
        throw new ApiError(409, "User with username or email already exists")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path
    const coverLocalPath = req.files?.coverImage?.[0]?.path

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    // const avatar = await uploadOnCloudinary(avatarLocalPath)
    // let coverImage = "" 
    
    // if(coverLocalPath) {
    //     coverImage = await uploadOnCloudinary(coverImage)
    // }

    let avatar;
    try{
        avatar = await uploadOnCloudinary(avatarLocalPath)
        console.log("Uploaded avatar , " , avatar)
    }
    catch(error) {
        console.log("Failed uploading avatar " , error)
        throw new ApiError(500, "Failed to upload avatar")
    }

    let coverImage;
    try{
        coverImage = await uploadOnCloudinary(coverLocalPath)
        console.log("Uploaded coverImage , " , coverImage)
    }
    catch(error) {
        console.log("Failed uploading coverImage " , error)
        throw new ApiError(500, "Failed to upload coverImage")
    }

    const user = await User.create({
        fullName,
        coverImage: coverImage?.url || "",
        avatar: avatar.url,
        email,
        username: username.toLowerCase(),
        password
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user")
    }

    return res
    .status(200)
    .json(
        new ApiResoponse(
            200,
            createdUser,
            "User register successfully"
        )
    )

})

export {
    registerUser
}