export class ResponseApi{
    constructor(status,message,data){
        this.message = message
        this.success = status < 400 ? true : false;;
        this.data = data;
        this.status = status;
    }
}