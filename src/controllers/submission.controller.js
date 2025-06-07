import { ApiResponse } from "../utils/responseApi.js"
import { prismaDb } from "../libs/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllSubmission = asyncHandler(async(req,res)=>{
    const {id} = req.user;
    const submission = await prismaDb.submission.findMany({
        where:{
            id
        }
    });

    res.status(200).json(new ApiResponse(200,submission,"Successfully fetched data"))
});

const getSubmissionById = asyncHandler(async(req,res)=>{
    const {problemId} = req.params;
    const {id} = req.user;
    const submissionId = await prismaDb.problem.findUnique({
        where:{
            id:problemId,
        },
        select:{
            title:true,
            submission:{
                where:{
                    problemId:problemId,
                    userId:id
                }
            }
            

        },
    })

    res.status(200).json(new ApiResponse(200,submissionId,"Successfully fetched data"))

});

const getSubmissionCount = asyncHandler(async(req,res)=>{
    const {problemId} = req.params;
    const {id} = req.user;
    const submissionCount = await prismaDb.submission.count({
        where:{
            problemId
        }
    })

    res.status(200).json(new ApiResponse(200,submissionCount,"Successfully fetched data"))

});

const getSubmissionDelete = asyncHandler(async(req,res)=>{
    const {problemId} = req.params;
    const {id} = req.user;
    const submissionCount = await prismaDb.submission.delete({
        where:{
            id:problemId,
            userId:id
        }
    })

    res.status(200).json(new ApiResponse(200,submissionCount,"Successfully fetched data"))

});

export {getAllSubmission,getSubmissionById,getSubmissionCount,getSubmissionDelete}