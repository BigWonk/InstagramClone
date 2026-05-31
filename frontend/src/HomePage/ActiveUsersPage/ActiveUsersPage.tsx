import Header from "../../Header/Header";
import "./activeUsers.css";
import {socket} from "../../App"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
interface User {
  id: number;
  username: string;
  email: string;
  profile_picture: string;
}





  
  
  
function ActiveUsersPage() {
  interface OnlineUser {
    userId: string | number;
    socketId: string;
  }

  const [users, setUsers] = useState<OnlineUser[]>([]);
  const[usersData, setUsersData] = useState<User[]>([])
  const navigate = useNavigate();

  useEffect(() => {
    const handleOnlineUsers = async (onlineUsers: OnlineUser[]) => {
        
            const validUsers = onlineUsers.filter((u) => u.userId != null);
            setUsers(validUsers);
    };
    
    

    socket.on("getOnlineUsers", handleOnlineUsers);
    return () => {
      socket.off("getOnlineUsers", handleOnlineUsers);
    };
  }, []);

  useEffect(() => {
    if (users.length === 0) {
      setUsersData([]);
      return;
    }

    const fetchUserDetails = async () => {
      const profiles = await Promise.all(
        users.map(async (u) => {
          const response = await fetch(`http://localhost:3001/api/users/getUser/${u.userId}`, {
            credentials: "include"
          });
          const json = await response.json();
          return json.user[0] as User;
        })
      );

      setUsersData(profiles);
    };

    fetchUserDetails();
  }, [users]);




  return (
  <div>
    <Header></Header>
 
  <div className="active-users-page">
      <div className="active-users-container">
        <div className="active-users-header">
          <h1>Active Users</h1>
          <p>{usersData.length} users online</p>
        </div>

        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="Search active users..." />
        </div>

        <div className="users-list">
          {usersData.map((user) => (
            <div className="user-card" key={user.id}>
              <div className="user-left">
                <div className="profile-wrapper">
                  <img src={user.profile_picture} alt={user.username} />
                  <span className="online-dot"></span>
                </div>

                <div className="user-info">
                  <h3>{user.username}</h3>
                  <p>{user.email}</p>
                </div>
              </div>

              <div className="user-actions">
                <button className="message-btn">Message</button>
                <button className="profile-btn" onClick={() => navigate(`/accounts?id=${user.id}`)}>View Profile</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
 </div>
  );
}

export default ActiveUsersPage;
