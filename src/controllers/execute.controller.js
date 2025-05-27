import { ApiError } from "../utils/errorApi.js";
import { ApiResponse } from "../utils/responseApi.js";
import { getJudge0LanguageId, languageName, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";
import { languageTemplate } from "../libs/languageTemplate.js";
import { prismaDb } from "../libs/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const executeCode = asyncHandler(async (req, res) => {
    let { source_code, language, codeSnippets, language_id, stdin, expected_outputs, problemId } = req.body
    const { id } = req.user

    console.log("execution Controller:- ",source_code, language, codeSnippets, language_id, stdin, expected_outputs, problemId);

    // console.log(!Array.isArray(stdin) || stdin.length === 0 || Array.isArray(expected_outputs || expected_outputs.length !== stdin.length));

    // validating 
    if (!Array.isArray(stdin) || stdin.length === 0 || !Array.isArray(expected_outputs || expected_outputs.length !== stdin.length)) {
        return res.status(400).json(new ApiError(400, false, [{ error: "invalid and missing text cases" }]))
    }

    language_id =  getJudge0LanguageId(language);

    // 2. prepare test cases for judge0 batch
    const submissions = stdin.map((input) => ({
        source_code:languageTemplate(codeSnippets,source_code,language),
        language_id,
        stdin: input
    }))

    console.log(submissions);

    
    // 3. send the submissions to the judge0 submission batch endpoint
    const submitResponse = await submitBatch(submissions);

    const tokens = submitResponse.map((res) => res.token);

    // 4. Poll judge0 for results of all submitted test cases
    const result = await pollBatchResults(tokens);
    console.log("Results------------", result);

    // analyse the results
    let allPassed = true;
    const detaildResult = result.map((result, i) => {
        const stdout = result.stdout?.trim();
        const expected_output = expected_outputs[i]?.trim();
        const passed = stdout === expected_output

        if (!passed) allPassed = false

        // making a object with details output
        return {
            testCases: i + 1,
            passed,
            stdout,
            expected: expected_output,
            compileOutput: result.compile_output,
            stderr: result.stderr || null,
            status: result.status.description,
            memory: result.memory ? `${result.memory} KB` : undefined,
            time: result.time ? `${result.time} s` : undefined,
        }
    })

    console.log("detaildResult:- ", detaildResult);
    // store the detailResult in db
    const submission = await prismaDb.submission.create({
        data: {
            userId: id,
            problemId,
            sourceCode: {[language]:source_code},
            language: languageName(language_id),
            stdin: stdin.join("\n"),
            stderr: JSON.stringify(detaildResult.map(e => e.stderr)),
            stdout: JSON.stringify(detaildResult.map(r => r.stdout)),
            compileOutput: detaildResult.some((r) => r.compileOutput) ? JSON.stringify(detaildResult.map(r => res.compileOutput)) : null,
            status: allPassed ? "Accepted" : "Wrong Answer",
            memory: detaildResult.some((r) => r.memory) ? JSON.stringify(detaildResult.map(r => r.memory)) : null,
            time: detaildResult.some((r) => r.time) ? JSON.stringify(detaildResult.map(r => r.time)) : null,
        }
    })

    // if AllPassed is true the mark problem done for the user
    if (allPassed) {
        await prismaDb.problemSolved.upsert({
            where: {
                userId_problemId: {
                    userId: id, problemId
                }
            },
            update:{},
            create:{
                userId: id, problemId
            }
        })
    }

    console.log("submission:- ", submission);
    

    // save indivisual testCase entry in db
    const testCasesSaving = detaildResult.map((r)=>
        ({           
            submissionId:submission.id,
            testCases:r.testCases,
            passed:r.passed,
            stdout:r.stdout,
            expected:r.expected,
            stderr:r.stderr,
            compileOutput:r.compileOutput,
            status:r.status,
            memory:r.memory,
            time:r.time,
            
        })
    );

    console.log("testCasesSaving:- ", testCasesSaving);
    

    await prismaDb.testCasesResult.createMany({
        data:testCasesSaving
    })

    const submissionCodeWithTestCase = await prismaDb.submission.findUnique({
        where:{
            id:submission.id
        },
        include:{
            testCases:true
        }
    })

    res.status(200).json(new ApiResponse(200, result, "Successfully executed code"))
})

export { executeCode }