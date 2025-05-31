import { asyncHandler } from "../utils/asyncHandler.js";
import { prismaDb } from "../libs/prisma.js";
import { getJudge0LanguageId, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";
import { ApiResponse } from "../utils/responseApi.js"
import { ApiError } from "../utils/errorApi.js"
import { languageTemplate } from "../libs/languageTemplate.js";
import axios from "axios"

const createProblem = asyncHandler(async (req, res) => {
    let { title, description, difficulty, tags, example, constraints, testCases, referenceSolution, codeSnippets, hints, templateCode,demo,company } = req.body;

    console.log("checking:- ", title, description, difficulty, tags, example, constraints, testCases, referenceSolution, codeSnippets, hints, templateCode);


    if (req.admin !== "ADMIN") {
        res.status(403).json(new ApiError(403, false, [{ error: "You are not allowed to create a problem" }]))
    }

    //  save the result in the database
    try {
        const newProblem = await prismaDb.problem.create({
            data: {
                title, description, difficulty, tags, example, constraints, testCases, referenceSolution, codeSnippets, hints, templateCode,demo,company, userId: req.user.id
            }
        })
        return res.status(201).json(new ApiResponse(201, newProblem, "Successfully Created Problem"))
    } catch (error) {
        console.log("Saving in database error occured", { cause: error })
        return res.status(500).json(new ApiError(500, "Server error", [{ error: error }]))

    }
});


const testingProblem = asyncHandler(async (req, res) => {
    // getting all data from req.body
    let { title, description, difficulty, tags, example, constraints, testCases, referenceSolution, codeSnippets, language } = req.body
    console.log(title, description, difficulty, tags, example, constraints, testCases, referenceSolution, codeSnippets, language);

    // i have wrote below code for execution one by one code
    referenceSolution = { [language]: referenceSolution[language] }
    console.log("new referenceSolution:- ", referenceSolution);


    console.log("createProblem:- ", req.admin)
    // checking user is admin role
    if (req.admin !== "ADMIN") {
        res.status(403).json(new ApiError(403, false, [{ error: "You are not allowed to create a problem" }]))
    }

    try {

       const response =  await axios.request({
            method:"GET",
            url:'https://judge0-ce.p.rapidapi.com/languages/52',
            headers:{
                'x-rapidapi-key': '2a61e5940fmshc460f798f52ba45p1166a1jsn3e521b5b3e5c',
                'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
            }
        });
        

        for (const [language, solutionCode] of Object.entries(referenceSolution)) {
            const languageId = getJudge0LanguageId(language);
            console.log(languageId);

            if (!languageId) {
                res.status(400).json(new ApiError(400, false, [{ error: `language ${language} is not supported` }]))
            }
            // i stuck here because i wrote like language_Id, so please language_id
            const submission = testCases.map(({ input, output }) => ({                
                source_code: languageTemplate(codeSnippets[language], solutionCode, language),
                language_id: languageId,
                stdin: input,
                // expected_output: output
            }))

            // console.log("submission:- ",submission);


            /* [{ token: '4c87de46-ddee-41ab-88cd-34e0337479e2' }, { token: 'fabc24d9-1b07-47ea-b989-e258c632278e' }, { token: '522c2590-8767-4113-995a-6149da38c27e' }] */
            const submissionResults = await submitBatch(submission);
            console.log("submissionResults:- ", submissionResults);


            const tokenResults = submissionResults.map((res) => res.token);

            const results = await pollBatchResults(tokenResults);
            console.log("Resulting of pollBatchResults", results, results.length);



            for (let i = 0; i < results.length; i++) {
                // console.log("Results-----",results);

                // i wrote previous like this const result = result[i], so it was a mistkae because it is overriding my above result, but it is not showing error in the code editor
                const result = results[i];
                console.log("single Result:- ", result);

                console.log(result.stdout,testCases[0].output,result.stdout==testCases[0].output);
                

                if (result.status.id !== 3) {
                    return res.status(200).json(new ApiResponse(201, results, "Some TestCase failed"));
                    // return res.status(400).json(new ApiError(400, false, [{ error: `TestCase ${i + 1} failed for language ${language}` }]))
                }
            }

            return res.status(200).json(new ApiResponse(201, results, "All testCase Passed"))
        }
    } catch (error) {
        console.log("error in creating Problem:- ", error);
        res.status(500).json(new ApiError(500, false, [{ error }]))
    }

})

const getAllProblems = asyncHandler(async (req, res) => {
    const problems = await prismaDb.problem.findMany({ select: { id: true, difficulty: true, title: true, updatedAt: true, createdAt: true,demo:true,company:true,tags:true } });
    if (!problems) {
        return res.status(404).json(new ApiError(404, false, [{ error: "Not Found" }]))
    }
    console.log("getProblems- ", problems);

    res.status(200).json(new ApiResponse(200, problems, "Successfuly fetched Problems"))
})

const getProblemsId = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const singleProblem = await prismaDb.problem.findUnique({
        where: {
            id
        }
    })

    if (!singleProblem) {
        return res.status(404).json(new ApiError(404, false, [{ error: "Problem not found" }]))
    }

    res.status(200).json(new ApiResponse(200, singleProblem, "Successfully Fetched data"))
})

// as a assignment
const updateProblemId = asyncHandler(async (req, res) => { })

const deleteProblemId = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const admin = req.admin;

    if (admin !== "ADMIN") {
        return res.status(403).json(new ApiError(403, false, [{ error: "Forbidden - You do not have permission to access this resource" }]))
    }

    const problemExisting = await prismaDb.problem.findUnique({
        where: {
            id
        }
    });

    if (!problemExisting) {
        return res.status(404).json(new ApiResponse(404, [], "Probelm does not exist"))
    }

    const deletedProblem = await prismaDb.problem.delete({ where: { id } });

    res.status(200).json(new ApiResponse(200, deletedProblem, "Successfully deleted problem"))
})

const getAllProblemSolvedUser = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    console.log("userId", userId);

    const userSubmittedProblem = await prismaDb.submission.groupBy({
        by: ['language', 'problemId'],
        where: {
            userId,
        },
        _count: true,
    });

    console.log("userSubmittedProblem:- ", userSubmittedProblem);


    const getUserSolvedProblems = await prismaDb.problemSolved.findMany({
        where: {
            userId,
        },
        // select:{
        //     problemId:true
        // },
        select: {
            // we have to use the problem not the problemId
            problem: {
                select: {
                    id: true,
                    title: true,
                    difficulty: true,
                }
            }
        }
    });

    const modifiedData = getUserSolvedProblems.map((v, i) => {
        console.log("v ki value:- ", v);
        
       const newdata =  userSubmittedProblem.filter((innerProblem,i)=>{
        console.log(innerProblem.problemId,v.problem.id);
        
            return innerProblem.problemId === v.problem.id
        });

        console.log("newdata:- ",newdata);
        
       return {title:v.problem.title,difficulty:v.problem.difficulty,id:v.problem.id,solvedLanguage:newdata}
    });

    console.log("modifiedData:- ",modifiedData);
    

    console.log(getUserSolvedProblems);
    res.status(200).json(new ApiResponse(200, modifiedData, "Successfully"))
})

export {
    testingProblem, createProblem, getAllProblems, getProblemsId, updateProblemId, deleteProblemId, getAllProblemSolvedUser
}