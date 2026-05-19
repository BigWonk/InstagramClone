import { use, useEffect, useState } from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";






function StoryCard({ username, image }) {
  return (
    <div className="story">
      <div className="story-ring">
        <img src={image} alt={username} />
      </div>

      <span>{username}</span>
    </div>
  );
}



function PostCard({
  username,
  profileImage,
  postImage,
  likes,
  caption,
  comments
}) {
  return (
    <div className="post">

      
      <div className="post-top">

        <div className="post-user">

          <img src={profileImage} alt={username} />

          <div className="post-user-info">
            <h4>{username}</h4>
          </div>

        </div>

        <i className="fa-solid fa-ellipsis"></i>

      </div>

      <div className="post-image">
        <img src={postImage} alt="Post" />
      </div>

      <div className="post-actions">

        <div className="left-actions">
          <i className="fa-regular fa-heart"></i>
          <i className="fa-regular fa-comment"></i>
          <i className="fa-regular fa-paper-plane"></i>
        </div>

        <i className="fa-regular fa-bookmark"></i>

      </div>

      <div className="post-likes">
        {likes} likes
      </div>

      <div className="post-caption">
        <span>{username}</span>
        {caption}
      </div>

      <div className="post-comments" >
        View all {comments} comments
      </div>



    </div>
  );
}



function HomePage() {
  
const navigate = useNavigate()
const [name, setName] = useState("");
const [postss, setPosts] = useState([]);

useEffect(() =>
{
  const fetchData = async () =>
  {
    const data = await fetch(`http://localhost:3001/api/posts/Allposts`,{
      credentials: "include"
    })
    const json = await data.json();
    const Posts = Array.isArray(json.posts) ? json.posts : [];
    setPosts(Posts);

  }
  fetchData()
},[])



const handleSearch = async () =>
{
  const data = await fetch(`http://localhost:3001/api/auth/verify`,{
      credentials: "include"
    })
    if(data.status === 200)
    {
    navigate(`/users?search=${encodeURIComponent(name)}`)
    }
    else
    {
      navigate("/login")
    }
}
const handleLike = async(id) =>
{
  const data = await fetch(`http://localhost:3001/api/posts/like/${id}`,{
    method: "POST",
    credentials: "include",
    headers: { 'Content-Type': 'application/json' }
  })
  if(data.status == 200)
  {
    location.reload();
  }
}



    return (
      <div>
        <Header></Header>
      
   <div className="page">
   

      <div className="app">



        <div className="header">

  <div className="logo">
    Instagram
  </div>

  <div className="header-right">

    <div className="search-bar">

      <i className="fa-solid fa-magnifying-glass"></i>

      <input type="text" placeholder="Search by name..." className="InputText" value ={name} onChange = {(e) => setName(e.target.value)} onKeyDown={(e) => {
        if (e.key === "Enter") {
        handleSearch();
      }
    }} />

    </div>

    <div className="header-icons">
      <i className="fa-regular fa-heart"></i>
      <i className="fa-regular fa-paper-plane"></i>
    </div>

  </div>

</div>





        <div className="posts">

          {postss.map((post) => (
             <div className="post" key = {post.id}>

      
      <div className="post-top">

        <div className="post-user">

          <img src={post.profile_picture} alt={post.username} />

          <div className="post-user-info">
            <h4>{post.username}</h4>
          </div>

        </div>

        <i className="fa-solid fa-ellipsis"></i>

      </div>

      <div className="post-image">
        <img src={post.image_url} alt="Post" />
      </div>

      <div className="post-actions">

      {post.checkliked ? (  <div className="left-actions">
          <button className="liked-button" type="button" aria-label={`Like ${post.username}'s post`} onClick={() => handleLike(post.id)}>
            <svg className="liked-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" />
            </svg>
            <span className="like-count">{post.likes_count}</span>
          </button>
          <i className="fa-regular fa-comment"></i>
          <i className="fa-regular fa-paper-plane"></i>
        </div>):   
        <div className="left-actions">
          <button className="like-button" type="button" aria-label={`Like ${post.username}'s post`} onClick={() => handleLike(post.id)}>
            <svg className="like-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" />
            </svg>
            <span className="like-count">{post.likes_count}</span>
          </button>
          <i className="fa-regular fa-comment"></i>
          <i className="fa-regular fa-paper-plane"></i>
        </div>}

        <i className="fa-regular fa-bookmark"></i>

      </div>

      <div className="post-likes">
        {post.likes_count} likes
      </div>

      <div className="post-caption">
        {post.caption}
      </div>

      <div className="post-comments" onClick={() => navigate(`/comments?id=${post.id}`)}>
        View all {post.comments_count} comments
      </div>



    </div>
          ))}

        </div>


        <div className="bottom-nav">

          <i className="fa-solid fa-house"></i>
          <i className="fa-solid fa-magnifying-glass"></i>
          <i className="fa-regular fa-square-plus"></i>
          <i className="fa-solid fa-clapperboard"></i>


        </div>

      </div>

    </div>
  </div>
  );
}

export default HomePage;