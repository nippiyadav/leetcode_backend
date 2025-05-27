import { app } from "./app.js";
import { dbConnection } from "./src/db/db.js";
const port = process.env.PORT??8000


dbConnection()
.then((res)=>{
    app.listen(port,()=>{
        console.log(`Your app is being listen on the port http://localhost:${port}`);
    })
})
.catch((e)=>{
    console.log(e);
})