import dotenv from "dotenv"
import {app} from "./app.js"
import { connectDB } from "./db/connection.js"   



dotenv.config({
    path : './.env'
})

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
