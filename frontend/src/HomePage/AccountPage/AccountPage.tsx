import { useNavigate } from "react-router-dom";
import "./account.css";
import { useEffect, useState } from "react";
import Header from "../../Header/Header";

const posts = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop",
  },
];

function AccountPage() {
      const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
   const [bio, setBio] = useState("")
    const [profile_picture, setProfilePicture] = useState<null | string>(null)
    const [followers, setFollowers] = useState("")
    const [following, setFollowing] = useState("")
    const navigate = useNavigate()
    useEffect(() =>
    {
        const fetchData = async() =>
        {
            const data = await fetch("http://localhost:3001/api/auth/me",{
              credentials: "include"
            })
            const json = await data.json()
            setUsername(json.username)
            setEmail(json.email)
            setBio(json.bio)
            setProfilePicture(json.profile_picture)
            const dataFollowers = await fetch("http://localhost:3001/api/users/followers",{
              credentials: "include"
            })
            const jsonFollowers = await dataFollowers.json()
            setFollowers(jsonFollowers.message[0].count)
            
            
            
            const dataFollowing = await fetch("http://localhost:3001/api/users/following",{
              credentials: "include"
            })
            const jsonFollowing = await dataFollowing.json()
            
            setFollowing(jsonFollowing.message[0].count)
        
          }




        fetchData()
    },[])
 
    return (
      <div>
        <Header></Header>
      
<div className="account-page">


      <div className="account-container">



        <div className="profile-section">

          <div className="profile-left">

            <img
              src={profile_picture}
              alt="Profile"
              className="profile-image"
            />

          </div>

          <div className="profile-right">

            <div className="username-row">

              <h1>
                {username}
              </h1>

              <button onClick={() => navigate("/editacc")}>
                Edit Profile
              </button>

            </div>

            <div className="profile-stats">

              <p>
                <span>{0}</span> posts
              </p>

              <p>
                <span>{followers}</span> followers
              </p>

              <p>
                <span>{following}</span> following
              </p>

            </div>

            <div className="profile-info">

              <h3>
               {username}
              </h3>

              <p className="email">
                {email}
              </p>

              <p className="bio">
                {bio}
              </p>

            </div>

          </div>

        </div>


        <div className="posts-section">

          <div className="posts-header">

            <h2>
              Posts
            </h2>

          </div>

          {posts.length > 0 ? (

            <div className="posts-grid">

              {posts.map((post) => (

                <div
                  className="post-card"
                  key={post.id}
                >

                  <img
                    src={post.image}
                    alt="Post"
                  />

                </div>

              ))}

            </div>

          ) : (

            <div className="no-posts">

              <i className="fa-regular fa-image"></i>

              <h3>
                No Posts Yet
              </h3>

              <p>
                When you upload photos or videos,
                they will appear here.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
    </div>
  );
}

export default AccountPage;