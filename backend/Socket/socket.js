import { Server } from "socket.io";
let onlineUsers = [];

export default function InitialiseSocket(server)
{
  const io = new Server(server, {
        cors:
        {
            origin: "http://localhost:5173",
            credentials: true
        }
    });

io.on("connection", (socket) =>
{
    console.log("user connected")
    socket.on("addUser", (userId) =>
    {
        const exists = onlineUsers.find(user => user.userId === userId);
        if(!exists)
        {
            onlineUsers.push({userId, socketId: socket.id})
        }

        io.emit("getOnlineUsers", onlineUsers)
    });
    socket.on("findUser",(userId) =>
    {
        const exists = onlineUsers.find(user => user.userId == userId);
        let check = "Offline"
        if(exists)
        {
            check = "Active now";
        }   
        io.emit("UserId", check)

    })
    socket.on("sendMessage", (userId, message) =>
    {
        const exists = onlineUsers.find(user => user.userId == userId);
        if (exists)
        {
              io.to(exists.socketId).emit("getMessage", message)
        }
    })
    socket.on("typing", (userId) =>
    {
        const exists = onlineUsers.find(user => user.userId == userId)
        if(exists)
        {
            io.to(exists.socketId).emit("userTyping")
        }
    })
    socket.on("disconnect", () =>
    {
        onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id)
        io.emit("UserId", "Offline")
        io.emit("getOnlineUsers", onlineUsers)
        console.log("user disconnected")

    })
})
}