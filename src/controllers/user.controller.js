import { prismaDb } from "../libs/prisma.js";
import { User } from "../models/mongodb/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/errorApi.js";
import { ApiResponse } from "../utils/responseApi.js";
import { commonFunction } from "../utils/utils.js";



const registerController = asyncHandler(async (req, res) => {
    const { username, password, fullname, email } = req.body
    const userSendValue = req.body;

    // console.log(userSendValue,userSendValue.password);

    for (const key in userSendValue) {
        if (!userSendValue[key]) {
            return res.status(404).json(new ApiError(404, "Please provide full details", [{ error: `Please provide full detail ${key}` }]))
        }
    }

/*/ this is the mongoose schema for mondodb connection
    const userAlreadyExist = await User.findOne({ email }).lean();
    if (userAlreadyExist) {
        return res.status(404).json(new ApiError(404, "User already exist", [{ error: "User already exist" }]))
    }

    const newUserCreated = await User.create({
        username: username,
        password: password,
        fullname: fullname,
        email: email
    })
/*/
    
    const userExisting = await prismaDb.user.findUnique({
       where:{email}
    });

    if (userExisting) {
        return res.status(404).json(new ApiError(404, "User already exist", [{ error: "User already exist" }]))
    }

    const hashPassword = await commonFunction.hasingPassword(password)

    const newUserMaking = await prismaDb.user.create({
        data:{
            username,
            password:hashPassword, 
            fullname,
            email
        }
    })

    res.status(200).json(new ApiResponse(200, "Successfully created user", {...newUserMaking,password:"",refreshToken:""}))
})

const loginController = asyncHandler(async (req, res) => {
    const { password, email } = req.body
    const userSendValue = req.body;

    console.log(userSendValue,userSendValue.password);

    for (const key in userSendValue) {
        if (!userSendValue[key]) {
            return res.status(404).json(new ApiError(404, "Please provide full details", [{ error: `Please provide full detail ${key}` }]))
        }
    }

    const userAlreadyExist = await prismaDb.user.findUnique({
        where:{
            email
        }
    })

    // console.log("User Existing:- ", userAlreadyExist);
    
    if (!userAlreadyExist) {
        return res.status(401).json(new ApiError(401, "User does not exist", [{ error: "User does not exist" }]))
    }

    const isCorrectPassword = await commonFunction.isPasswordCorrect(password,userAlreadyExist.password)

    if (!isCorrectPassword) {
        return res.status(404).json(new ApiError(404, "Invalid credentials", [{ error: "Invalid credentials" }]))
    }


    // setting the cookies
    // console.log("accesstoken in loginController:- ",userAlreadyExist.id);
    
    const accessToken = commonFunction.accessToken(userAlreadyExist.id);
    const refreshToken = commonFunction.refreshToken(userAlreadyExist.id,userAlreadyExist.username,userAlreadyExist.email);


    const newData = await prismaDb.user.update({
        where:{
            email
        },
        data:{
            refreshToken:refreshToken
        }
    });

    // console.log("updating Data in the login for the ",newData);
    
    // const options = {
    //     httpOnly: true,
    //     secure:true,
    //     sameSite: "none",
    //     priority:"high",
    //     maxAge: 1000 * 60 * 60 * 24
    // }

    // cookie Options
    
    res.setHeader(
        "Authorization", `Bearer ${accessToken}`
    );
    
    const options = {
        httpOnly: process.env.NODE_ENV !== "production"?false:true,
        // secure: process.env.NODE_ENV !== "production"?false:true,
         secure:true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24
    }
    res.cookie("accessToken", accessToken, options)

    console.log(accessToken,refreshToken);


    res.status(200).json(new ApiResponse(200, newData,"Successfully User login"))
})

const currentUser = asyncHandler(async (req,res)=>{
    const {id} = req?.user;
    
    if (!id) {
        return res.status(404).json(new ApiError(404,"Id does not exist in authentionctio Middleware",[{error:"Id does not exist in authentionctio Middleware here"}]))
        
    }

    const currentUser = await prismaDb.user.findUnique({
        where:{
            id
        },
        select:{
            username:true,
            email:true,
            fullname:true,
            fullname:true,
            role:true,
            createdAt:true,
            updatedAt:true
        }
    })
    if (!currentUser) {
        return res.status(404).json(new ApiError(404,"User does not exist",[{error:"User does not exist here"}]))
    }
    res.status(200).json(new ApiResponse(200,currentUser,"Successfully Fetched user details"))
})

const logOut = asyncHandler(async (req,res)=>{
    const {id} = req?.user;
    
    if (!id) {
       return  res.status(404).json(new ApiError(404,"Id does not exist in authentionctio Middleware",[{error:"Id does not exist in authentionctio Middleware here"}]))
        
    }

    const currentUser = await prismaDb.user.update({
        where:{
            id
        },
        data:{
            refreshToken:""
        }
    });

    if (!currentUser) {
       return  res.status(404).json(new ApiError(404,"User does not exist",[{error:"User does not exist here"}]))
    }

    res.clearCookie("accessToken",{
        httpOnly:process.env.NODE_ENV !== "development",
        sameSite:"lax",
        secure:process.env.NODE_ENV !== "development"
    })

    res.status(200).json(new ApiResponse(200,[],"Successfully did logout"))
})







export { registerController, loginController, currentUser,logOut }