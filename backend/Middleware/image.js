import express from "express"
import multer from "multer"
import path from "path"
const app = express()

const storage = multer.diskStorage({
    destination: (req, file, cb) =>
    {
        cb(null, "Posts/")
    },
    filename: (req,file,cb) =>
    {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})


export const upload = multer({storage: storage})


