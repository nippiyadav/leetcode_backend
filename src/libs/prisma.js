import {PrismaClient} from "../generated/prisma/index.js";

const globalForPrisma = globalThis;

// console.log(globalForPrisma );

export const prismaDb = globalForPrisma.prisma || new PrismaClient();

// in local it is undefined, evalute par tru hoha, globalForPrisma jo ki ek object hold karta hai wo bhi globalThis ka referesh object, us ke under a new prisma key banata hai, aur prismaDb ki value jo ki uper new PrismaClient se aae hai jo ki ek object of different methods put ho  ja egi
if (process.env.NODE !== "production") globalForPrisma.prisma = prismaDb;

// console.log(process.env.NODE !== "production" );
// console.log(db );