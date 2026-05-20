import express from "express"
import cors from "cors"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import pool from "../index.js"
import { protect } from "../Middleware/auth.js"
import { upload } from "../Middleware/image.js"

const router = express.Router()


router.post("/uploadPost", protect, upload.single("file"), async (req, res) =>
{
    const userId = req.user.id
    const {caption} = req.body
    let post = null
    if(req.file)
    {
        post = `http://localhost:3001/Posts/${req.file.filename}`
    }
    try 
    {
        const result = await pool.query("INSERT INTO posts(user_id, caption, image_url) VALUES($1,$2,$3)", [userId, caption, post])
        return res.status(200).json({comment: result.rows})
    } 
    catch (error) 
    {
        console.log(error)
        return res.status(500).json({message: "Error while uploading a post"})    
    }
})
router.get("/Allposts",protect,async(req, res) =>
{
    try 
    {
        const userId = req.user.id
        const result = await pool.query(`SELECT posts.*, users.username, users.profile_picture, users.id AS user_id, COUNT(DISTINCT likes.user_id) AS likes_count, COUNT(DISTINCT comments.user_id) AS comments_count, CASE WHEN COUNT(DISTINCT CASE WHEN likes.user_id = $1 THEN 1 END) > 0 THEN true ELSE false END AS checkliked FROM posts 
            JOIN users ON users.id = posts.user_id 
            LEFT JOIN likes ON posts.id = likes.post_id 
            LEFT JOIN comments ON posts.id = comments.post_id    
            
            GROUP BY posts.id,
                users.username,
                users.profile_picture,
                users.id`, [userId])    

        return res.status(200).json({posts: result.rows})
    } 
    catch (error) 
    {
         console.log(error)
        return res.status(500).json({message: "Error while fetching all posts"})    
    }
})
router.get("/post/:id", protect, async(req, res) =>
{
    try 
    {
        const postId = req.params.id
        const result = await pool.query(`SELECT posts.*, COUNT(DISTINCT likes.user_id) AS likes_count, COUNT(DISTINCT comments.user_id) AS comments_count FROM posts 
            LEFT JOIN likes ON posts.id = likes.post_id 
            LEFT JOIN comments ON posts.id = comments.post_id    
            WHERE posts.id = $1
            GROUP BY posts.id`
                ,[postId])     
        return res.status(200).json({post: result.rows})
    } 
    catch (error) 
    {
    console.log(error)
        return res.status(500).json({message: "Error while fetching a post by id"})        
    }
})
router.get("/postsByUser", protect, async(req, res) =>
{
    try 
    {
        const userId = req.user.id
        const result = await pool.query(`SELECT posts.*, COUNT(DISTINCT likes.user_id) AS likes_count, COUNT(DISTINCT comments.user_id) AS comments_count FROM posts 
            LEFT JOIN likes ON posts.id = likes.post_id 
            LEFT JOIN comments ON posts.id = comments.post_id    
            WHERE posts.user_id = $1
            GROUP BY posts.id`
                ,[userId])     
        return res.status(200).json({posts: result.rows})
    } 
    catch (error) 
    {
    console.log(error)
        return res.status(500).json({message: "Error while fetching a post by id"})        
    }
})
router.get("/postsByUser/:id", protect, async(req, res) =>
{
    try 
    {
        const userId = req.params.id
        const result = await pool.query(`SELECT posts.*, COUNT(DISTINCT likes.user_id) AS likes_count, COUNT(DISTINCT comments.user_id) AS comments_count FROM posts 
            LEFT JOIN likes ON posts.id = likes.post_id 
            LEFT JOIN comments ON posts.id = comments.post_id    
            WHERE posts.user_id = $1
            GROUP BY posts.id`
            , [userId])     
        return res.status(200).json({posts: result.rows})
    } 
    catch (error) 
    {
    console.log(error)
        return res.status(500).json({message: "Error while fetching a post by id"})        
    }
})
router.get("/checkLiked/:id", protect, async(req, res) =>
{
    try 
    {
        const userId = req.user.id
        const postId = req.params.id
        const result = await pool.query("SELECT * FROM likes WHERE user_id = $1 AND post_id = $2", [userId,postId])     
        if(result.rows.length > 0)
        {
            return res.status(200).json({message: "already liked!"})
        }
        else
        {
            return res.status(304).json({message: "havent liked!"})
        }
    } 
    catch (error) 
    {
    console.log(error)
        return res.status(500).json({message: "Error while fetching likes by id"})        
    }
})
router.post("/like/:id", protect, async (req, res) =>
{
    const userId = req.user.id
    const postId = req.params.id
    let message = ""
    try 
    {
        const check = await pool.query("SELECT * FROM likes WHERE user_id = $1 AND post_id = $2", [userId, postId])
        if(check.rows.length > 0)
        {
            const Unlike = await pool.query("DELETE FROM likes WHERE user_id = $1 AND post_id = $2", [userId, postId])
            message = "Unliked"
        }
        else
        {
            const like = await pool.query("INSERT INTO likes(user_id, post_id) VALUES($1, $2)",[userId, postId])
            message = "Liked"

        }
    
        return res.status(200).json({status: message})
    } 
    catch (error) 
    {
        console.log(error)
        return res.status(500).json({message: "Server error while liking an post"})    
    }
})
router.delete("/delete/:id", protect, async(req,res) =>
{
    const userId = req.user.id
    const postId = req.params.id
    try     
    {
        const result = await pool.query("DELETE FROM posts WHERE id = $1 AND user_id = $2",[postId,userId])
        return res.status(204).json({message: "Succesfully deleted the post!"})
    } 
    catch (error) 
    {
        console.log(error)
        return res.status(500).json({message: "Server error while deleting an post"})
    }
})
router.get("/checkId/:id", protect, async(req,res) =>
{
    const userId = req.user.id
    const UserId = req.params.id
    
    if(userId == UserId)
    {
        return res.status(200).json({isOwner: true})
    }
    else if(userId != UserId)
    {
        return res.status(302).json({isOwner: false})
    }
})

router.post("/comment/:id", protect, async (req, res) =>
{
    const userId = req.user.id
    const postId = req.params.id
    const {content} = req.body
    try 
    {
        const result = await pool.query("INSERT INTO comments(user_id, post_id,content) VALUES($1,$2,$3) RETURNING *", [userId,postId,content])
        return res.status(200).json({comment: result.rows})
    } 
    catch (error) 
    {
        console.log(error)
        return res.status(500).json({message: "Error while posting an comment"})    
    }
})
router.get("/comments/:id",protect,async(req, res) =>
{
    const postId = req.params.id
    try 
    {
        const result = await pool.query(`SELECT comments.content, users.username, users.profile_picture, users.id AS user_id
            FROM comments 
            JOIN users ON users.id = comments.user_id 
            WHERE comments.post_id = $1`, [postId])    

        return res.status(200).json({comments: result.rows})
    } 
    catch (error) 
    {
         console.log(error)
        return res.status(500).json({message: "Error while fetching all comments"})    
    }
})


export default router