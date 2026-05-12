import { useEffect, useState } from "react";
import "./followers.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../Header/Header";

interface User {
  id: number;
  username: string;
  followers: number;
  profileImage: string;
  verified: boolean;
}

interface UserCardProps {
  username: string;
  followers: number;
  profileImage: string;
  verified: boolean;
  followStatus: boolean;
}





function UserCard({
  username,
  followers,
  profileImage,
  verified,
  followStatus
}: UserCardProps) {
  return (
    <div className="user-card">

      <div className="user-left">

        <img
          src={profileImage}
          alt={username}
          className="user-image"
        />

        <div className="user-info">

          <div className="username-row">

            <h3>{username}</h3>

            {verified && (
              <i className="fa-solid fa-circle-check verified"></i>
            )}

          </div>


          <p className="followers-count">
            {followers} followers
          </p>

        </div>

      </div>

      {followStatus ? (
        <button className="follow-btn">
          Follow
        </button>
      ) : (
        <button className="unfollow-btn">
          Unfollow
        </button>
      )}

    </div>
  );
}

function FollowersPage() {
  const [result, setResult] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [followStatuses, setFollowStatuses] = useState<Record<number, boolean>>({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";




  const handleSearch = async () => {
    const data = await fetch(`http://localhost:3001/api/auth/verify`, {
      credentials: "include"
    })
    if(data.status === 200)
    {
    navigate(`/users?search=${encodeURIComponent(name)}`)
    location.reload();
    }
    else
    {
      navigate("/login")
    }
}

useEffect(() => {
  const getData = async () => {
    if (!search) {
      setResult([]);
      setFollowStatuses({});
      return;
    }

    const data = await fetch(`http://localhost:3001/api/users/search/${encodeURIComponent(search)}`, {
      credentials: "include"
    });
    const json = await data.json();
    const Followers = Array.isArray(json.product) ? json.product : [];
    setResult(Followers);

    const statuses: Record<number, boolean> = {};
    await Promise.all(
      Followers.map(async (user: User) => {
        if (typeof user.id !== "undefined") {
          const response = await fetch(`http://localhost:3001/api/users/checkFollow/${user.id}`, {
            credentials: "include"
          });
          statuses[user.id] = response.status !== 200;
        }
      })
    );
    setFollowStatuses(statuses);
  };

  getData();
}, [search]);


const followUser = async(id) =>
{
  if(typeof id !== "undefined")
  {
    const data = await fetch(`http://localhost:3001/api/users/follow/${id}`,{
      method: "POST",
      credentials: "include",
       headers: { 'Content-Type': 'application/json' },
    })
    if(data.status == 200)
    {
      location.reload();
    }
  }
  
}

const unFollowUser = async(id) =>
{
  if(typeof id !== "undefined")
  {
    const data = await fetch(`http://localhost:3001/api/users/unfollow/${id}`,{
      method: "DELETE",
      credentials: "include",
       headers: { 'Content-Type': 'application/json' },
    })
    if(data.status == 204)
    {
      location.reload();
    }
  }
}


  return (
    <div>
      <Header />
      <div className="followers-page">

        <div className="followers-container">



        <div className="search-section">

          <h1>
            Search Users
          </h1>

          <div className="search-bar">

            <i className="fa-solid fa-magnifying-glass"></i>

            <input type="text" placeholder="Search by name..." className="InputText" value ={name} onChange = {(e) => setName(e.target.value)} onKeyDown={(e) => {
        if (e.key === "Enter") {
        handleSearch();
      }
    }} />

          </div>

        </div>


        <div className="results">

          {result.map((user) => (
                
                <div className="user-card" key={user.id}>

      <div className="user-left">

        <img
          src={user.profileImage}
          alt={user.username}
          className="user-image"
        />

        <div className="user-info">

          <div className="username-row">

            <h3>{user.username}</h3>

            {user.verified && (
              <i className="fa-solid fa-circle-check verified"></i>
            )}

          </div>


          <p className="followers-count">
            {user.followers} followers
          </p>

        </div>

      </div>

      {followStatuses[user.id] ? (
        <button className="follow-btn" onClick={() => followUser(user.id)}>
          Follow
        </button>
      ) : (
        <button className="unfollow-btn" onClick={() => unFollowUser(user.id)}>
          Unfollow
        </button>
      )}

    </div>
          ))}

        </div>

      </div>

    </div>
  </div>
  );
}

export default FollowersPage;