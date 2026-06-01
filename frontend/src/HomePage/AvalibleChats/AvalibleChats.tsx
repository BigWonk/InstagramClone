import { useEffect, useState } from "react";
import Header from "../../Header/Header";
import "./avalibleChats.css";
import { useNavigate } from "react-router-dom";

function AvalibleChats() {


  const [conversationss, setConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() =>
{
    const fetchData = async() => 
    {
        const data = await fetch(`http://localhost:3001/api/conversations/conversationsUser/`,{
        credentials: "include"
      }) 
      const json = await data.json()
      const Conversations = Array.isArray(json.conversation) ? json.conversation : []
      setConversations(Conversations)
    }
    fetchData()
},[])


  return (
    <div>
    <Header></Header>
    <div className="chats-page">

      <div className="chats-container">

        <div className="chats-header">

          <div>
            <h1>Messages</h1>
            <p>{conversationss.length} conversations</p>
          </div>


        </div>

        <div className="search-container">

          <i className="fa-solid fa-magnifying-glass"></i>

        
        </div>

        <div className="conversations-list">

          {conversationss.map((chat) => (

            <div
              className="conversation-card"
              key={chat.id}
                onClick={() => navigate(`/chatpage?id=${chat.id}`)}
            >

              <div className="conversation-left">

                <div className="profile-wrapper">

                  <img
                    src={chat.profile_picture}
                    alt={chat.username}
                  />

                  {chat.online && (
                    <span className="online-dot"></span>
                  )}

                </div>

                <div className="conversation-info">

                  <h3>{chat.username}</h3>

                  <p>{chat.last_message}</p>

                </div>

              </div>

              <div className="conversation-right">



                {chat.notseen_count > 0 && (
                  <div className="unread-count">
                    {chat.notseen_count}
                  </div>
                )}

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
</div>
  );
}

export default AvalibleChats;