import { useNavigate } from "react-router-dom";
import "./account.css";
import { useEffect, useState } from "react";
import Header from "../../Header/Header";


function AccountPage() {
      const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
   const [bio, setBio] = useState("")
    const [profile_picture, setProfilePicture] = useState<null | string>(null)
    const [followers, setFollowers] = useState(0)
    const [following, setFollowing] = useState(0)
    const[posts, setPosts] = useState([]);
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
            
            const PostsData =  await fetch("http://localhost:3001/api/posts/postsByUser",{
              credentials: "include"
            })
            const jsonPosts = await PostsData.json()
            const Posts = Array.isArray(jsonPosts.posts) ? jsonPosts.posts : [];
            setPosts(Posts)
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

              <button onClick={() => navigate("/account/edit")}>
                Edit Profile
              </button>

            </div>

            <div className="profile-stats">

                 <button onClick={() => navigate("/account/post")}>
                Make a post
              </button>
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

                <div onClick={() => navigate(`/comments?id=${post.id}`)}
                  className="post-card"
                  key={post.id}
                >

                  <img
                    src={post.image_url}
                    alt="Post"
                  />
                   <div className="post-overlay">

                    <p>
                      ❤ {post.likes_count}
                    </p>

                    <p>
                      💬 {post.comments_count}
                    </p>

                  </div>
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