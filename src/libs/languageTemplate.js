export const languageTemplate = (codeSnippets,solutionCode,language)=>{
    // console.log(codeSnippets);
    
    if (language==="java") {
       const refrenceSolution = codeSnippets.replace("{{solution}}",solutionCode);
       console.log("refrenceSolution:- ",refrenceSolution);
       return refrenceSolution
    }else{
        console.log("languageTemplateCode:- ",`${solutionCode}\n\n${codeSnippets}`);
        return `${solutionCode}\n\n${codeSnippets}`
    }
}