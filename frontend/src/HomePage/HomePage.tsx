import { use, useEffect, useState } from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";

const stories = [
  {
    id: 1,
    username: "victor",
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    username: "alex",
    image: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    username: "julia",
    image: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 4,
    username: "maria",
    image: "https://i.pravatar.cc/150?img=4",
  },
];


const posts = [
  {
    id: 1,
    username: "traveler",
    location: "Italy",
    profileImage: "https://i.pravatar.cc/150?img=6",
    postImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
    likes: "12,482",
    caption: "Beautiful sunset in Italy 🇮🇹",
    comments: 382,
    time: "4 HOURS AGO",
  },
  {
    id: 2,
    username: "photography",
    location: "New York",
    profileImage: "https://i.pravatar.cc/150?img=9",
    postImage:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
    likes: "7,934",
    caption: "NYC nights 🌃",
    comments: 104,
    time: "9 HOURS AGO",
  },
];



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
  location,
  profileImage,
  postImage,
  likes,
  caption,
  comments,
  time,
}) {
  return (
    <div className="post">

      
      <div className="post-top">

        <div className="post-user">

          <img src={profileImage} alt={username} />

          <div className="post-user-info">
            <h4>{username}</h4>
            <p>{location}</p>
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

      <div className="post-comments">
        View all {comments} comments
      </div>

      <div className="post-time">
        {time}
      </div>

    </div>
  );
}



function HomePage() {
  
    const navigate = useNavigate()
const [name, setName] = useState("");
    
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

          {posts.map((post) => (
            <PostCard
              key={post.id}
              username={post.username}
              location={post.location}
              profileImage={post.profileImage}
              postImage={post.postImage}
              likes={post.likes}
              caption={post.caption}
              comments={post.comments}
              time={post.time}
            />
          ))}

        </div>


        <div className="bottom-nav">

          <i className="fa-solid fa-house"></i>
          <i className="fa-solid fa-magnifying-glass"></i>
          <i className="fa-regular fa-square-plus"></i>
          <i className="fa-solid fa-clapperboard"></i>

          <img
            src="https://i.pravatar.cc/150?img=11"
            alt="Profile"
          />

        </div>

      </div>

    </div>
  </div>
  );
}

export default HomePage;