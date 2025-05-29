import jwt from "jsonwebtoken";
import { prismaDb } from "../libs/prisma.js";
import { ApiError } from "../utils/errorApi.js";

const authenticaiton = (req, res, next) => {

    let value = req.cookies;
    console.log("value:- ", value);


    if (!value.accessToken) {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json(new ApiError(401,"Please login",[{error:"Please Login"}]))
        }
    
        value =  authHeader.split(" ")[1];
    }




    // let domi = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODBiNjg1OGI3NWRhNzhiMzY1YmU2MTYiLCJ1c2VybmFtZSI6ImNoYW5kYW5AeWFkYXYiLCJpYXQiOjE3NDU1Nzk5NTJ9.bofcx7q93g4jwoOUquwI1SsE85nVRwiyUkjDZ7_0MiU"

    try {
        const JwtJsonObject = jwt.verify(value.accessToken, process.env.ACCESS_TOKEN_SECRET_KEY);
        // console.log("JwtJsonObject:- ",JwtJsonObject);

        req.user = JwtJsonObject ?? {}

    } catch (error) {
        // console.log(error.message);

        return res.status(500).json(new ApiError(500, error.message, [{ error: error.message }]))
    }

    next()
}

const checkAdmin = async (req, res, next) => {
    try {
        const { id } = req.user;
        const userRole = await prismaDb.user.findUnique({
            where: {
                id
            },
            select: {
                role: true
            }
        });

        console.log("userRole", userRole);


        if (!userRole || userRole.role !== "ADMIN") {
            return res.status(403).json(new ApiError(403, false, [{ error: "Forbidden - You do not have permission to access this resource" }]))
        }
        req.admin = userRole.role
        next()
    } catch (error) {
        console.log("Error in CheckAdmin", error);

    }
}

export { authenticaiton, checkAdmin }
