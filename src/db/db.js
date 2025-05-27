import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

// console.log("db Conneciton url:- ",process.env.MONGO_URL);


const dbConnection = async () => {
    try {
        const connectionObj = await mongoose.connect(`${process.env.MONGO_URL}/leetnoob`);
        return connectionObj
    } catch (error) {
        throw new Error(`Connection failed in db.js file:-  ${error}`)
    }
}

export {dbConnection}