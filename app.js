import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRouter from "./src/routes/user.route.js"
import problemRouter from "./src/routes/problem.route.js"
import executeRouter from "./src/routes/execute.route.js"
import submissionRouter from "./src/routes/submission.route.js"
import fs from "fs";
import { ApiResponse } from "./src/utils/responseApi.js";
import cors from "cors";

const app = express();

dotenv.config({
    path:"./env"
});

console.log(process.env.NODE_ENV !== "production"?process.env.FRONTEND_API_DEVELOPMENT:process.env.FRONTEND_API_PRODUCTION);


app.use(cors({
    origin:process.env.NODE_ENV !== "production"?process.env.FRONTEND_API_DEVELOPMENT:process.env.FRONTEND_API_PRODUCTION,
    credentials:true,
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use("/user",userRouter)
app.use("/problem",problemRouter)
app.use("/execute-code",executeRouter)
app.use("/submission",submissionRouter)


app.get("/health",(req,res)=>{
    // console.log("Starting");
    // const data = fs.readFileSync(0,"utf-8");
    // console.log(data);
    // console.log("ending");
    let value = req.cookies;
    console.log("value:- ",value);
    res.status(200).json({backend:"running smoothly",cookies:value})
})


export {app}