import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class UtilsClasses {
    constructor() {
    }

    async isPasswordCorrect(password, hashPassword) {
        console.log(this);
        const isCorrect = await bcrypt.compare(password, hashPassword);
        console.log(isCorrect);
        return isCorrect
    }

    async hasingPassword(password) {
        const hashPassword = await bcrypt.hash(password, 10);
        console.log("hashPassword:- ", hashPassword);
        return hashPassword
    }

    refreshToken(id, username, email) {
        const refreshToken = jwt.sign({ id, username, email }, process.env.REFRESH_TOKEN_SECRET_KEY,{expiresIn:"7d"})
        return refreshToken
    }

    accessToken(id) {
        const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET_KEY,{expiresIn:"1d"})
        return accessToken
    }
}

export const commonFunction = new UtilsClasses()