import express from "express"
import cors from "cors"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import pool from "../index.js"
import { protect } from "../Middleware/auth.js"
const router = express.Router()

const cookieOptions =
{
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",    
    maxAge: 30 * 24 * 60 * 60 * 1000
}

const generateToken = (id) =>
{
    return jwt.sign({id}, process.env.JWT_SECRET)
}

router.post("/login", async (req, res) =>
{
    try 
    {
       const {username, password} = req.body 
       if(!username || !password)
       {
            return res.status(404).json({message: "Please send all required fields!"})
       }
       const user = await pool.query("SELECT * FROM users WHERE username = $1", [username])
       if(user.rows.length === 0)
       {
           return res.status(404).json({message: "User with this username doesnt exist!"})
       }
        const userData = user.rows[0];
        const isMatch = bcrypt.compare(password, userData.password)
        if(!isMatch)
        {
             return res.status(404).json({message: "Wrong password"})
        }
    const token = generateToken(userData.id);
    res.cookie("token", token, cookieOptions)
    res.json({user: {id: userData.id, name: userData.name, email: userData.email}})
    return res.status(200).json({message: "User logged in succesfully"})
} 
    catch (error) 
    {
                console.log(error)
        return res.status(500).json({message: "Server error while registering"})
    }
})

router.post("/register", async (req, res) =>
{
    try 
    {
       const {username ,email, password, profile_picture} = req.body 
       if(!email || !password || !username || !profile_picture)
       {
            return res.status(404).json({message: "Please send all required fields!"})
       }
       const user = await pool.query("SELECT * FROM users WHERE email = $1", [email])
    
       if(user.rows.length != 0)
       {
           return res.status(404).json({message: "User with this email already exist!"})
       }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const registering = await pool.query("INSERT INTO users (username,email,password,profile_picture) VALUES ($1, $2, $3, $4) RETURNING *", [username, email, hashedPassword, profile_picture])
    const token = generateToken(registering.rows[0].id);
    res.cookie("token", token, cookieOptions)
    return res.status(201).json({message: "User created succesfully"})
    } 
    catch (error) 
    {
        console.log(error)
        return res.status(500).json({message: "Server error while registering"})
    }
})
router.get("/me", protect, (req,res) =>
{
    res.json(req.user)
})
router.post("/logout", protect, (req,res)=>
{
    res.cookie("token", "", {...cookieOptions, maxAge: 1})
   return res.status(204).json({message: "User logged out succesfully"})
})
router.get("/verify", protect, (req,res) =>
{
   return res.status(200).json({ valid: true ,user: req.user})
})
export default router