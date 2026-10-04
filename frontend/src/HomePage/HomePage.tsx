import { use, useCallback, useEffect, useRef, useState } from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import { API_URL } from "../../../backend/api";


function HomePage() {
  
const navigate = useNavigate()
const [name, setName] = useState("");
const [postss, setPosts] = useState([]);
const [cursor, setCursor] = useState(null);
const [hasMore, setHasMore] = useState(true);
const [loading, setLoading] = useState(false);
const loaderRef = useRef(null);
const isFetchingRef = useRef(false)
const [logged, setLogged] = useState(false);
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
   const [error, setError] = useState("")

  const handleSubmit = async(e) =>
  
    {
      e.preventDefault()
      const data = await fetch (`${API_URL}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({username: username.trim(),password: password.trim()})
    })
    const json = await data.json()
    if(!data.ok)
    {
      setError(json.message || "Unable to log in")
      return
    }
    navigate("/account")
  
  }



const checkLogged = async () =>
{
  const data = await fetch(`${API_URL}/api/auth/me`,{
      credentials: "include"
    })
    if(data.status != 200)
    {
        setLogged(false) 
    }
    else
    {
      setLogged(true)
    } 
 console.log(false)
}
 useEffect(() =>
{
  checkLogged()
  console.log(false)
},[])


  const fetchData = useCallback(async () => {
   if (!hasMore || loading || isFetchingRef.current) return;
   isFetchingRef.current = true;
   setLoading(true);
    try {
      const url = cursor
        ? `${API_URL}/api/posts/Allposts?cursor=${cursor}`
        : `${API_URL}/api/posts/Allposts`;

      const data = await fetch(url, { credentials: "include" });
      if (!data.ok) {
        setHasMore(false);
        return;
      }

      const json = await data.json();
      const Posts = Array.isArray(json.posts) ? json.posts : [];
      setPosts((prev) => [...prev, ...Posts]);

      const lastPost = Posts[Posts.length - 1];
      if (lastPost && lastPost.id != null) {
        setCursor(lastPost.id);
      }

      setHasMore(Posts.length === 5);
      } catch (err) {
      console.error("fetchData error:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [cursor, hasMore]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchData();
    });

    const node = loaderRef.current;
    observer.observe(node);

    return () => observer.disconnect();
  }, [hasMore, fetchData]);




const handleSearch = async () =>
{
  const data = await fetch(`${API_URL}/api/auth/verify`,{
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
  const data = await fetch(`${API_URL}/api/posts/like/${id}`,{
    method: "POST",
    credentials: "include",
    headers: { 'Content-Type': 'application/json' }
  })
  if(data.status == 200)
  {
    location.reload();
  }
}
const handleUser = async(id) =>
{
  const data = await fetch(`${API_URL}/api/posts/checkId/${id}`,
    {
    credentials:"include"
    })
  if(data.status == 200)
  {
    navigate("/account")
  }
  else
  {
    navigate(`/accounts?id=${id}`)
  }
}
console.log(logged)


    return ( logged ? (<div>
        <Header></Header>
      
   <div className="page">
   

      <div className="app">



        <div className="header">

  <div className="logo">
    Smegmagram
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

        <div className="post-user" onClick={() => handleUser(post.user_id)}>

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

          {loading && <p>Loading...</p>}
          
      <div ref={loaderRef}></div>
        

        
      </div>

    </div>
  </div>)
    :
    (<div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
            alt="Social Media"
          />
        </div>

        <div className="login-right">
          <div className="login-card">

            <form className="login-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Username"
                value = {username}
                onChange={(e) => {setUsername(e.target.value)} }
              />

              <input
                type="password"
                placeholder="Password"
                value = {password}
                onChange={(e) => {setPassword(e.target.value)} }
              />

              <button type="submit">
                Log In
              </button>
              <h3>{error}</h3>
            </form>
          </div>

          <div className="register-card">
            <p>Don't have an account?</p>
            <a href="/register">Sign up</a>
          </div>

        </div>

      </div>

    </div>)
      
  );
}


export default HomePage;