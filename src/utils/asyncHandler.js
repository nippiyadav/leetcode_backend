
/**
 * 
 * @param {*async function} asynFn 
 * @returns callback function 
 * 
 * this fucntion take a function as a parameter and return a callback function and it get req,res and next as parameter and it run that in asynfn passing parameter 
 */
function asyncHandler(asynFn){
    return (req,res,next)=>{
        Promise.resolve(asynFn(req,res,next))
        .catch(err=> next(err))
    }
}

export {asyncHandler}