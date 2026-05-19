import express from "express"
import cors from "cors"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { Pool } from "pg"
import cookieParser from "cookie-parser"
import authRouter from "./Routes/auth.js"
import userRouter from "./Routes/users.js"
import postRouter from "./Routes/posts.js"
dotenv.config()
const app = express()

const {PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGSSLMODE, PGCHANNELBINDING} = process.env;

const pool = new Pool({
    host:PGHOST,
    database:PGDATABASE,
    user:PGUSER,
    password: PGPASSWORD,
    port:5432,
})


app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }));
app.use(express.json())
app.use(cookieParser())
app.use("/ProfilePictures", express.static("ProfilePictures"));
app.use("/Posts", express.static("Posts"));
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);

app.listen(3001, () =>
{
    console.log("port is listening on http://localhost:3001")
})
export default pool