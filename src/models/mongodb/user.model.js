import mongoose from "mongoose";
import bcrptjs from "bcryptjs";
import jwt from "jsonwebtoken"

const userModel = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    fullname: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        required: true

    },
    avatar: {
        type: String
    },
    banner: {
        type: String
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true });

userModel.pre("save", async function (next) {
    console.log("password hashing:- ", this);

    if (this.isModified("password")) {
        const hashedPassword = await bcrptjs.hash(this.password, 10);
        console.log("password hashing:- ", this);
        this.password = hashedPassword
    }
    console.log("after password hashing:- ", this);
    next()
})

userModel.methods.isPasswordCorrect = async function (userPassword) {
    const isPassworldCorrect = await bcrptjs.compare(userPassword, this.password);
    console.log("isPasswordCorrect:- ", isPassworldCorrect);

    return isPassworldCorrect
}

userModel.methods.accessTokenGenerate = function () {
    // console.log(this);

    const accessToken = jwt.sign({
        _id: this._id.toString(),
        username: this.username
    }, process.env.ACCESS_TOKEN_SECRET_KEY);

    return accessToken
}

userModel.methods.refreshTokenGenerate = function () {
    const refreshToken = jwt.sign(this._id.toString(), process.env.REFRESH_TOKEN_SECRET_KEY);

    return refreshToken
}

export const User = mongoose.model("User", userModel) 