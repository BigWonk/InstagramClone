import express from "express"
import cors from "cors"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { Pool } from "pg"
import http from "http"
import cookieParser from "cookie-parser"
import authRouter from "./Routes/auth.js"
import userRouter from "./Routes/users.js"
import postRouter from "./Routes/posts.js"
import messagesRouter from "./Routes/messages.js"

import { Server } from "socket.io"
import InitialiseSocket from  "./socket/socket.js";

dotenv.config()

const app = express()

const server = http.createServer(app)

const {PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGSSLMODE, PGCHANNELBINDING} = process.env;

const pool = new Pool({
    host:PGHOST,
    database:PGDATABASE,
    user:PGUSER,
    password: PGPASSWORD,
    port:5432,
})
InitialiseSocket(server)

const allowedOrigins = ["http://192.168.0.141:5173", "http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json())
app.use(cookieParser())
app.use("/ProfilePictures", express.static("ProfilePictures"));
app.use("/Posts", express.static("Posts"));
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/conversations", messagesRouter);

server.listen(3001, "0.0.0.0", () =>
{
    console.log("port is listening on http://0.0.0.0:3001")
})
export default pool