import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app =  express()
app.use(cors({
    origin: process.env.CORS_ORIGIN, //for now, allowing from all sources
    credentials: true,
}))

app.use(express.json({limit : "16kb"}))                         //accept json data (forms)  
app.use(express.urlencoded({extended: true , limit: "16kb"}))   //accept from URLs
app.use(express.static("public"))                               //To store images, pdf etc - if needed
app.use(cookieParser())                                         //to be able to access and set user's browser cookies



//Routers 
import skillGapRoutes from "./routes/skillGap.routes.js";
import learningRoutes from "./routes/learning.routes.js";
import jobRoutes from "./routes/job.routes.js";
import verificationRoutes from "./routes/verification.routes.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js"


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/skills", verificationRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/learning", learningRoutes);
app.use("/api/skill-gap", skillGapRoutes);




  


export { app }