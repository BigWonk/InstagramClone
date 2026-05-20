import pool from "../index.js";
import express from "express"
import { protect } from "../Middleware/auth.js"
import { upload } from "../Middleware/image.js";

const router = express.Router()

router.get("/checkFollow/:id", protect, async(req, res) =>
{
    try 
    {
        const userId = req.user.id;
        const followId = parseInt(req.params.id, 10);

        if (Number.isNaN(followId)) {
            return res.status(400).json({message: "Invalid user id"});
        }

        const check  = await pool.query("SELECT following_id FROM followers WHERE follower_id = $1 AND following_id = $2", [userId, followId])
        if(check.rows.length > 0)
        {
            return res.status(200).json({message: "You have already followed this user!"}) 
        }  
        else
        {
            return res.status(204).json({message: "User not followed"}) 
        }

    } 
    catch (error) 
    {
        console.log(error);
        res.status(500).json({message: "Internal server error while checking follow status!"})
    }
    
})

router.get("/followers", protect, async(req,res) =>
{
    try 
    {
        const userId = req.user.id
        const result = await pool.query("SELECT COUNT(follower_id) FROM followers WHERE following_id = $1 ", [userId])
        return res.status(200).json({message: result.rows})

    } 
    catch (error)
    {
        console.log(error);
        res.status(500).json({message: "Internal server error while getting followers count"})
    }
})
router.get("/followers/:id", protect, async(req,res) =>
{
    try 
    {
        const userId = req.params.id
        const result = await pool.query("SELECT COUNT(follower_id) FROM followers WHERE following_id = $1 ", [userId])
        return res.status(200).json({message: result.rows})

    } 
    catch (error)
    {
        console.log(error);
        res.status(500).json({message: "Internal server error while getting followers count"})
    }
})

router.get("/following", protect, async(req,res) =>
{
    try 
    {
        const userId = req.user.id
        const result = await pool.query("SELECT COUNT(following_id) FROM followers WHERE follower_id = $1 ", [userId])
        res.status(200).json({message: result.rows})
    } 
    catch (error)
    {
        console.log(error);
        res.status(500).json({message: "Internal server error while getting followers count"})
    }
})
router.get("/following/:id", protect, async(req,res) =>
{
    try 
    {
        const userId = req.params.id
        const result = await pool.query("SELECT COUNT(following_id) FROM followers WHERE follower_id = $1 ", [userId])
        res.status(200).json({message: result.rows})
    } 
    catch (error)
    {
        console.log(error);
        res.status(500).json({message: "Internal server error while getting followers count"})
    }
})

router.put("/edit", protect, upload.single("image"), async (req,res) =>
{
    const userId = req.user.id
    const {username, email, bio} = req.body;
    let profile_picture = null 
    if(req.file)
        {
           profile_picture = `http://localhost:3001/Posts/${req.file.filename}`;
        }
    
    try 
    {
        const result = await pool.query("UPDATE users SET username = $1, profile_picture = $2, bio = $3, email = $4 WHERE id = $5 RETURNING *", [username, profile_picture, bio, email, userId])
        
        return res.status(200).json({message: "Succesfully updated user profile!"}) 
    } 
    catch (error) 
    {
        console.log(error)
        return res.status(500).json({message: "Internal server error while updating user!"}) 
    }

})
router.post("/follow/:id", protect, async(req,res) =>
{
    const userId = req.user.id;
    const followId = parseInt(req.params.id, 10);
    try 
    {   
        if (Number.isNaN(followId)) {
            return res.status(400).json({message: "Invalid user id"});
        }

        if(userId === followId)
        {
             return res.status(400).json({message: `Cannot follow yourself!`}) 
        }

        const check  = await pool.query("SELECT following_id FROM followers WHERE follower_id = $1 AND following_id = $2", [userId, followId])
        if(check.rows.length > 0)
        {
            return res.status(400).json({message: "You have already followed this user"}) 
        }

        const user = await pool.query("SELECT * FROM users WHERE id = $1", [followId])
        if (user.rows.length === 0) {
            return res.status(404).json({message: "User not found"})
        }

        await pool.query("INSERT INTO followers(follower_id, following_id) VALUES($1, $2)", [userId, followId])
        return res.status(200).json({message: `Succesfully followed user with id: ${followId}`}) 

    } 
    catch (error) 
    {
         console.log(error)
        return res.status(500).json({message: "Internal server error while following an user!"}) 
    }
})
router.delete("/unfollow/:id", protect, async(req,res)=>
{
     const userId = req.user.id;
    const followId = parseInt(req.params.id, 10);

    if (Number.isNaN(followId)) {
        return res.status(400).json({message: "Invalid user id"});
    }

    try 
    {
        
        const result = await pool.query("DELETE FROM followers WHERE follower_id = $1 AND following_id = $2", [userId, followId])
        return res.status(204).json({message: `Succesfully unfollowed user with id: ${followId}`}) 
    } 
    catch (error) 
    {
        console.log(error)
        return res.status(500).json({message: "Internal server error while unfollowing an user!"}) 
    }
})
router.get("/search/:name", protect, async(req,res) =>
{
    try 
    {
        const userName = req.user.username
        const username = req.params.name;
        
        const result = await pool.query("SELECT * FROM users WHERE username ILIKE $1 EXCEPT SELECT * FROM users WHERE username = $2", [`%${username}%`, userName] )
        res.status(200).json({product: result.rows})
        
    } 
    catch (error) 
    {
        console.log(error);
        res.status(500).json({message: "Internal server error while searching for a user"})
    }
})

router.get("/getUser/:id", protect, async (req, res) =>
{
   const id = parseInt(req.params.id, 10)
   if (Number.isNaN(id)) {
        return res.status(400).json({message: "Invalid user id"});
   }
    try 
    {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [id])
        return res.status(200).json({user: result.rows})
    } 
    catch (error) 
    {
        console.log(error)
        return res.status(500).json({message: "Internal server error while getting information for user!"})
    }

})

export default router