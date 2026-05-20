import { useEffect, useState } from "react";
import "./userProfile.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../Header/Header";

const posts = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop"
  }
];

function UserProfilePage() {
   
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id") || "";
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
   const [bio, setBio] = useState("")
    const [profile_picture, setProfilePicture] = useState<null | string>(null)
    const [followers, setFollowers] = useState("")
    const [following, setFollowing] = useState("")
    const[posts, setPosts] = useState([]);
    const [followStatus, setFollowStatus] = useState(false);
    const navigate = useNavigate()
    
    useEffect(() =>
    {
        const fetchData = async() =>
        {
            const data = await fetch(`http://localhost:3001/api/users/getUser/${id}`,{
              credentials: "include"
            })
            const json = await data.json()
            

            setUsername(json.user[0].username)
            setEmail(json.user[0].email)
            setBio(json.user[0].bio)
            setProfilePicture(json.user[0].profile_picture)
            
            const dataFollowers = await fetch(`http://localhost:3001/api/users/followers/${id}`,{
              credentials: "include"
            })
            const jsonFollowers = await dataFollowers.json()
            setFollowers(jsonFollowers.message[0].count)
            
            
            
            const dataFollowing = await fetch(`http://localhost:3001/api/users/following/${id}`,{
              credentials: "include"
            })
            const jsonFollowing = await dataFollowing.json()
            setFollowing(jsonFollowing.message[0].count)
            
            const PostsData =  await fetch(`http://localhost:3001/api/posts/postsByUser/${id}`,{
              credentials: "include"
            })
            const jsonPosts = await PostsData.json()
            const Posts = Array.isArray(jsonPosts.posts) ? jsonPosts.posts : [];
            setPosts(Posts)
            
            const followData =  await fetch(`http://localhost:3001/api/users/checkFollow/${id}`,{
              credentials: "include"
            })
            if(followData.status == 200)
            {
                setFollowStatus(false)
            }
            else
            {
                 setFollowStatus(true)
            }
            const checkId = await fetch(`http://localhost:3001/api/posts/checkId/${id}`,
            {
                credentials:"include"
            })
            if(checkId.status == 200)
            {
              navigate("/account")
            }

        }
        fetchData()
    },[])
    const followUser = async(id) =>
    {
        const followData =  await fetch(`http://localhost:3001/api/users/follow/${id}`,{
              method: "POST",
              credentials: "include",
              headers: { 'Content-Type': 'application/json' }
            })
            if(followData.status == 200)
            {
                location.reload();
            }
    }
        const unFollowUser = async(id) =>
    {
        const followData =  await fetch(`http://localhost:3001/api/users/unfollow/${id}`,{
              method: "DELETE",
              credentials: "include",
              headers: { 'Content-Type': 'application/json' }
            })
            if(followData.status == 204)
            {
                location.reload();
            }
        }
  
  
    return (
    <div>
        <Header></Header>
    
    <div className="user-profile-page">

     
      <div className="user-profile-container">



        <div className="profile-header">



          <div className="profile-left">

            <img
              src={profile_picture}
              alt="Profile"
              className="profile-picture"
            />

          </div>



          <div className="profile-right">

            <div className="username-row">

              <h1>
                {username}
              </h1>

               {followStatus ? (
        <button className="follow-btn" onClick={() => followUser(id)}>
          Follow
        </button>
      ) : (
        <button className="unfollow-btn" onClick={() => unFollowUser(id)}>
          Unfollow
        </button>
      )}

              <button className="message-btn">
                Message
              </button>

            </div>


            <div className="profile-stats">

              <p>
                <span>{posts.length}</span> posts
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
                {email}
              </h3>

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

            <div className="posts-grid" >

              {posts.map((post) => (

                <div
                  className="post-card "
                  key={post.id}
                  onClick={() => navigate(`/comments?id=${post.id}`)}
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
                This user has not uploaded any posts.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
</div>
  );
}

export default UserProfilePage;