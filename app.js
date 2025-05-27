import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRouter from "./src/routes/user.route.js"
import problemRouter from "./src/routes/problem.route.js"
import executeRouter from "./src/routes/execute.route.js"
import submissionRouter from "./src/routes/submission.route.js"
import fs from "fs";
import { ApiResponse } from "../../cohort_backend/src/utils/apiResponse.js";
import cors from "cors";

const app = express();

dotenv.config({
    path:"./env"
});

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    
    
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use("/user",userRouter)
app.use("/problem",problemRouter)
app.use("/execute-code",executeRouter)
app.use("/submission",submissionRouter)


app.post("/",(req,res)=>{
    console.log("Starting");
    const data = fs.readFileSync(0,"utf-8");
    console.log(data);
    console.log("ending");
    res.status(200).json(new ApiResponse(200,[],"Successfully fetched Data"))
})


export {app}