import axios from "axios"
export const getJudge0LanguageId = (language) => {
    const languageMap = {
        JAVA: 62,
        PYTHON: 71,
        JAVASCRIPT: 63
    }

    return languageMap[language.toUpperCase()] || null
}

// i got 422 error that data sending is invalid formate
export const submitBatch = async (submissions) => {
    try {
        // console.log("submissions in submitBatch:- ", submissions);
        // console.log("process.env.JUDGE0_API_URL:- ", process.env.JUDGE0_API_URL);


        const headers = {
            'x-rapidapi-key': '2a61e5940fmshc460f798f52ba45p1166a1jsn3e521b5b3e5c',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
        }

        const { data } = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`, { submissions }, {
            headers
        });

        console.log("Submission Result: ", data);

        return data
    } catch (error) {
        console.log("Error in submitBatch:- ", error.errors);
    }

}

const sleep = (ms) => new Promise((resovle) => setTimeout(resovle, ms))

// 404 shows that no route exist with that name, i wrote submission/batch in place of submissions/batch
export const pollBatchResults = async (resultTokens) => {
    /*[4c87de46-ddee-41ab-88cd-34e0337479e2,           fabc24d9-1b07-47ea-b989-e258c632278e            522c2590-8767-4113-995a-6149da38c27e]*/

    console.log("resultTokens in pollBatchResult:- ", resultTokens);


    while (true) {
        try {
            const options = {
                method: 'GET',
                url: `${process.env.JUDGE0_API_URL}/submissions/batch`,
                params: {
                    tokens: resultTokens.join(","),
                    base64_encoded: false,
                    fields: '*'
                },
                headers: {
                    'x-rapidapi-key': '2a61e5940fmshc460f798f52ba45p1166a1jsn3e521b5b3e5c',
                    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
                }
            };

            const {data} = await axios.request(options);
	        // console.log(data);


            /*this types of url will construct
            http://localhost:2358/submission/batch?tokens=07f6e8df-b750-4f08-b766-91c1c1d198dd,6ee5d9fd-e861-4d08-8b75-eff39c625704,d9f6b12c-b55c-4ddb-b2db-b07e54bc1850&base64_encoded=false */

            // console.log(data);

            const results = data.submissions;
            // console.log("results:- ",results);

            /*
            [
                {
                    stdout: '300\n',
                    time: '0.111',
                    memory: 33004,
                    stderr: null,
                    token: '74f40969-1ff5-4c73-91dc-07dd486c588b',
                    compile_output: null,
                    message: null,
                    status: { id: 3, description: 'Accepted' }
                },
            */

            const isAllDone = results.every((result) => result.status.id !== 1 && result.status.id !== 2)

            if (isAllDone) return results

            await sleep(5000)
        } catch (error) {
            console.log("Error in pollBatchresult Error:- ", error);
            throw new Error("Server error in pollBatchResults", error.data)
        }
    }
}


export const languageName = (language_id) => {
    language_id = Number(language_id);
    const language_Name = {
        62: "JAVA",
        71: "PYTHON",
        63: "JAVASCRIPT"
    }

    console.log("language_id:- ", language_Name[language_id], language_id);


    return language_Name[language_id] || null
}