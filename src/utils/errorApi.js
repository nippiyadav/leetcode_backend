export class ErrorApi extends Error{
    constructor(status,message,error=[],stack){
        super(message);
        this.message = message;
        this.success = status >= 400 ? false : true
        this.error = error
        if (stack) {
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}