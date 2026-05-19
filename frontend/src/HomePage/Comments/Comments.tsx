import { useEffect, useState } from "react";
import Header from "../../Header/Header";
import "./comments.css";
import { useNavigate, useSearchParams } from "react-router-dom";


function CommentsPage() {
 const [commentss, setComments] = useState([]);
const [post, setPost] = useState<object>();
const [content, setContent] = useState("");
const [likeStatus, setLikeStatus] = useState(false);
 const [searchParams] = useSearchParams();
 const id = searchParams.get("id") || "";

 const navigate = useNavigate();
 useEffect(() =>
{
  const fetchData = async () =>
  {
    const data = await fetch(`http://localhost:3001/api/posts/comments/${id}`,{
      credentials: "include"
    })
    const json = await data.json();
    const Comments = Array.isArray(json.comments) ? json.comments : [];
    setComments(Comments);
   
    const post = await fetch(`http://localhost:3001/api/posts/post/${id}`,{
      credentials: "include"
    })
    const postJson = await post.json();
    setPost(postJson)

    const dataStatus = await fetch(`http://localhost:3001/api/posts/checkLiked/${id}`,{
      credentials: "include"
    })
    if(dataStatus.status == 200)
    {
      setLikeStatus(true);
    }
    else
    {
      setLikeStatus(false);

    }


  }
  fetchData()
},[])

  const handleSubmit = async(e) =>
  
    {
        e.preventDefault()
        const data = await fetch(`http://localhost:3001/api/posts/comment/${id}`,{
        method: "POST",
        credentials: "include",  
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({content})  
    })
    if(data.status == 200)
    {
        location.reload()
    }
    else
    {
        navigate("/")
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
<div className="comments-page">

      <div className="comments-container">


        <div className="post-preview">

          <img
            src={post?.post[0].image_url}
            alt="Post"
            className="post-image"
          />

        </div>


        <div className="comments-section">

          <div className="comments-header">

            <h2>
              Comments
            </h2>

            
            <p>
              {commentss.length} comments
            </p>
            
            
            {likeStatus ? (<button className="liked-button" type="button"  onClick={() => handleLike(id)}>
            <svg className="liked-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" />
            </svg>
            <span className="like-count">{post?.post[0].likes_count}</span>
          </button>): 
          (<button className="like-button" type="button"  onClick={() => handleLike(id)}>
            <svg className="like-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" />
            </svg>
            <span className="like-count">{post?.post[0].likes_count}</span>
          </button>)}

          <p>{post?.post[0].caption}</p>
          </div>

          <div className="comments-list">

            {commentss.map((comment) => (

              <div
                className="comment-card"
                key={comment.id}
              >

                <img
                  src={comment.profile_picture}
                  alt={comment.username}
                  className="comment-profile"
                />

                <div className="comment-content">

                  <div className="comment-top">

                    <h4>
                      {comment.username}
                    </h4>

                    <span>
                    </span>

                  </div>

                  <p>
                    {comment.content}
                  </p>

                </div>

              </div>

            ))}

          </div>


          <form className="comment-form">

            <input
              type="text"
              placeholder="Add a comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <button type="submit" onClick={handleSubmit}>
              Post
            </button>

          </form>

        </div>

      </div>

    </div>
    </div>
  );
}

export default CommentsPage;