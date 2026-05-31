import express from "express";
import pool from "../index.js";
import { protect } from "../Middleware/auth.js"
import { upload } from "../Middleware/image.js"
const router = express.Router()

router.post("/addConversation/:id", protect, async(req,res) =>
{
    const userId = req.user.id;
    const memberId = req.params.id;

    try 
    {
        const existing = await pool.query(`SELECT conversations.id FROM conversations
            JOIN conversation_members cm1
            ON conversations.id = cm1.conversation_id
            JOIN conversation_members cm2
            ON conversations.id = cm2.conversation_id 
            WHERE cm1.user_id = $1 AND cm2.user_id = $2`
            ,[userId, memberId])
            
            if(existing.rows.length > 0)
            {
                return res.status(200).json({conversation: existing.rows})
            }
            else
            {
                const conv = await pool.query(`INSERT INTO conversations DEFAULT VALUES RETURNING *`)
                const convId = conv.rows[0].id;   
            
                const members = await pool.query(`INSERT INTO conversation_members(conversation_id, user_id) VALUES ($1, $2), ($1, $3)`, [convId, userId, memberId]);
                return res.status(200).json({conversation: conv.rows})

            }


    } 
    catch (error) 
    {
        console.log(error);
        return res.status(500).json({message: "Internal server error while making an conversation"})    
    }

})
router.get("/conversationsUser", protect, async (req,res) =>
{
    const userId = req.user.id
    
    try 
    {
          const result = await pool.query(`SELECT conversations.*, conversation_members.user_id, users.username, users.profile_picture 
            FROM conversation_members

            JOIN conversations ON conversation_members.conversation_id = conversations.id
            JOIN users ON conversation_members.user_id = users.id
            WHERE conversation_members.user_id != $1
            GROUP BY
             conversations.id, conversation_members.user_id, users.username, users.profile_picture `, [userId])

            return res.status(200).json({conversation: result.rows})
    } 
    catch (error) 
    {
        console.log(error);
        return res.status(500).json({message: "Internal server error while getting conversations"})    
    }
})
router.get("/conversation/:id", protect, async (req,res) =>
{
    const conversationId = req.params.id
    const userId = req.user.id

    try 
    {
        const result = await pool.query(`SELECT conversations.*, conversation_members.user_id, users.username, users.profile_picture FROM conversations
            JOIN conversation_members ON conversation_members.conversation_id = conversations.id
            JOIN users ON users.id = conversation_members.user_id
            WHERE conversations.id = $1 AND conversation_members.user_id != $2
            GROUP BY
             conversations.id, conversation_members.user_id, users.username, users.profile_picture `, [conversationId, userId])

            return res.status(200).json({conversation: result.rows})
    } 
    catch (error) 
    {
        console.log(error);
        return res.status(500).json({message: "Internal server error while getting an conversation"})    
    }
})
router.post("/messagePost/:id", protect, upload.single("file"), async (req,res) =>
{
    try 
    {
        const userId = req.user.id
        const conversationId = req.params.id
        const {content} = req.body
        let image_url = null
        if(req.file)
        {
             image_url = `http://localhost:3001/Posts/${req.file.filename}`
        }
        const result = await pool.query(`INSERT INTO messages(conversation_id, sender_id,content,image_url) VALUES($1,$2,$3,$4) RETURNING *`, [conversationId,userId,content,image_url])
        return res.status(200).json({message: result.rows})    
    }
    catch (error) 
    {
        console.log(error);
        return res.status(500).json({message: "Internal server error while sending an message"})    
    }
})
router.get("/messages/:id", protect, async (req,res) =>
{
    try 
    {
        const conversationId = req.params.id
        const result = await pool.query(`SELECT * FROM messages WHERE conversation_id = $1 ORDER BY id`, [conversationId])
        return res.status(200).json({message: result.rows})    
    }
    catch (error) 
    {
        console.log(error);
        return res.status(500).json({message: "Internal server error while sending an message"})    
    }
})
router.delete("/message/:id", protect, async (req,res) =>
{
    try 
    {
        const messageId = req.params.id
        const result = await pool.query(`DELETE FROM messages WHERE id = $1 `, [messageId])
        return res.status(204).json({message: result.rows})    
    }
    catch (error) 
    {
        console.log(error);
        return res.status(500).json({message: "Internal server error while deleting an message"})    
    }
})
router.put("/seen/:id", protect, async(req,res) =>
{
    try 
    {
    const conversationId = req.params.id
    const userId = req.user.id
    const result = await pool.query("UPDATE messages SET is_seen = true WHERE conversation_id = $1 AND sender_id != $2 RETURNING *", [conversationId, userId])
    return res.status(200).json({message: result.rows})    

    } 
    catch (error) 
    {
        console.log(error);
        return res.status(500).json({message: "Internal server error while seeing an message"})    
    }
})

export default router

