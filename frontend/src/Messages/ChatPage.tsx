import { useEffect, useRef, useState } from "react";
import "./chatPage.css";
import { useFetcher, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../Header/Header";
import {socket} from "../App"
import { IoSend } from "react-icons/io5";
import { CiFileOn } from "react-icons/ci";



function ChatPage() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id") || "";
    const[username, setUsername] = useState<string | null>(null);
    const[pfp, setPfp] = useState("");
     const[messagess, setMessages] = useState([]);
     const[userId, setUserId] = useState();
     const[content, setContent] = useState("");
     const[file, setFile] = useState<File | null>(null);
     const [checkOnline, setCheckOnline] = useState("Offline");
     const[receiverId, setReceiverId] = useState();
     const [typing, setTyping] = useState(false);
     const [previewImage,setPreviewImage] = useState<string>();
         
     const listRef = useRef(null);
     const navigate = useNavigate();

     


useEffect(() =>
{
    const fetchData = async() =>
    {
      const UserData = await fetch(`http://localhost:3001/api/conversations/conversation/${id}`,{
        credentials: "include"
      }) 
      const jsonUserData = await UserData.json()
      setUsername(jsonUserData.conversation[0].username)
      setReceiverId(jsonUserData.conversation[0].user_id)
      setPfp(jsonUserData.conversation[0].profile_picture)
    }
    fetchData()
}, [])


  useEffect(() =>
  {

    const handleGetMessage = (message) => {
      setMessages((prev) => [
        ...prev,
        {
          ...message,
          id: message.id,
        },
      ]);
    };

   

    const fetchAllData = async() =>
    {
      
      const MessagesData = await fetch(`http://localhost:3001/api/conversations/messages/${id}`,{
        credentials: "include"
      }) 
      const jsonMessagesData = await MessagesData.json()
      const Messages = Array.isArray(jsonMessagesData.message) ? jsonMessagesData.message : [];

      setMessages(Messages);
       const HostData = await fetch(`http://localhost:3001/api/auth/me`,{
        credentials: "include"
      }) 
      const jsonHostData = await HostData.json()
      setUserId(jsonHostData.id)
      const seenMessages = await fetch(`http://localhost:3001/api/conversations/seen/${id}`,
        {
          method: "PUT",
          credentials:"include"
        })
        
        
    socket.on("getMessage", handleGetMessage);

    
     
     
     
      }
    fetchAllData()
     return () => socket.off("getMessage", handleGetMessage);

  },[])

  useEffect(() =>
  {
    if(!receiverId) return
    const handleUserStatus = (check) =>
    {
    setCheckOnline(check);
    }
    socket.emit("findUser", receiverId)
    socket.on("UserId", handleUserStatus)

    
      return () => socket.off("getOnlineUsers", handleSubmitMessage);
      
  },[receiverId])



  const handleSubmitMessage = async(e) =>
    {
        e.preventDefault()
      const formData = new FormData();
        formData.append("file", file);
        formData.append("content", content);
        const data = await fetch(`http://localhost:3001/api/conversations/messagePost/${id}`,{
          method: "POST",
          credentials: "include",
          body: formData
        })
        const json = await data.json();
        const message = json.message?.[0];
        if (data.status === 200 && message) {
          socket.emit("sendMessage", receiverId, message);
          setMessages((prev) => [
            ...prev,
            {
              ...message,
              id: message.id,
            },
          ]);

          setContent("");
          setFile(null);
          

          
        }

      }
  useEffect(() =>
  { 
    listRef.current?.lastElementChild?.scrollIntoView()
  }, [messagess])
  

  useEffect(() =>
{ 
  socket.emit("typing",receiverId)
},[content])
  socket.on("userTyping", () =>
  {
    setTyping(true)

    setTimeout(() =>
    {
      setTyping(false)
    }, 100000)
  })

 

  return (
    <div>
      <Header></Header>
   
    <div className="chat-page">

      <div className="chat-container">


        <div className="chat-header">

          <div className="chat-user">

            <img
              src={pfp}
              alt="Profile"
            />

            <div>

              <h3>
               {username}
              </h3>
              <p>{checkOnline}</p>
              

            </div>

          </div>

        </div>


        <div className="messages-container">

          {messagess.map((message) => (

            <div ref={listRef}
              key={message.id}
              className={
                message.sender_id == userId
                  ? "message-row own"
                  : "message-row"
              }
            >

              <div 
                className={
                  message.sender_id == userId
                    ? "message-bubble own"
                    : "message-bubble"
                }
              >

                {message.image_url != null ? (
                  <div className="img-message" >
                  <img src={message.image_url} alt="image" />
                  <p>{message.content}</p>
                  </div>
                ):
                (
                 <p>{message.content}</p>
                )}



              </div>

            </div>

          ))}

        </div>

          {typing ? (<p className="typing">{username} is typing...</p>): (<p></p>)}
          {file ? (<div style={{position: "relative", display: "flex", justifyContent: "flex-start", alignItems: "flex-start"}}>
            <button onClick={() => setFile(null)} style={{
              position: "absolute",
              top: "5px",
              right: "5px",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: "10",
              
            }}>X</button>
            <img src={previewImage} alt="the image you selected" style={{maxHeight: 100, maxWidth:100, marginLeft:10 }}></img>
          </div>): (<p></p>)}
        <form className="chat-input-container">
          


          <label className="file-upload-btn">

            <CiFileOn style={{ fontSize: 30}}></CiFileOn>

            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                 setFile(e.target.files?.[0] || null)
                  const filee = e.target.files?.[0]
                 setPreviewImage(URL.createObjectURL(filee))
              }}
              
              
            />

          </label>


          
          <input
          type="text"  
          placeholder="Message..."
            value={content}
            onChange={(e) => setContent(e.target.value)} 
          />


          <button type="submit" onClick={handleSubmitMessage}>

           
           <IoSend style={{ fontSize: 30}} ></IoSend>

          </button>

        </form>

      </div>

    </div>
  </div>
  );
}

export default ChatPage;