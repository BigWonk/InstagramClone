import express from "express"
import cors from "cors"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import pool from "../index.js"


export const protect = async(req, res, next) => 
{
        try 
        {
            const token = req.cookies.token
            if(!token)
            {
            return res.status(404).json({message: "Token not found"})
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await pool.query("SELECT id, username, email, bio, profile_picture FROM users WHERE id = $1 ", [decoded.id])
            if(user.rows.length === 0)
            {
            return res.status(404).json({message: "User not found"})
            }
            
            req.user = user.rows[0]
            next()
        }    
         
        catch (error) 
        {
            console.log(error)
            res.status(500).json({message: "Internal server error while getting token!"})
        }
}
