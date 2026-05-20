import { useEffect, useState } from "react";
import Header from "../../Header/Header";
import "./createPost.css";
import { useNavigate } from "react-router-dom";

function CreatePostPage() {
  
    const [user, setUser] = useState();
    const [caption, setCaption] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const navigate = useNavigate();

    useEffect(() =>
    {
        const fetchData = async() =>
        {
            const data = await fetch("http://localhost:3001/api/auth/me",{
              credentials: "include"
            })
            const json = await data.json();
            setUser(json)
        }
        fetchData()
    }, [])
    
    const handlePost = async() =>
    {
        if (!file) {
            alert("Please select a file");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("caption", caption);

        const data = await fetch("http://localhost:3001/api/posts/uploadPost",
            {
                method: "POST",
                credentials: "include",
                body: formData
            })
            if(data.status == 200)
            {
                navigate("/account")
            }
    }
  
    return (
    <div>
        <Header></Header>

    <div className="create-post-page">

      <div className="create-post-container">



        <div className="create-post-header">

          <h1>
            Create Post
          </h1>

          <button onClick={handlePost}>
            Post
          </button>

        </div>



        <div className="create-post-content">


          <div className="image-upload-section">

            <div className="image-preview">

              <i className="fa-regular fa-image"></i>

              <p>
                Upload Photo or Video
              </p>

            </div>

            <input
              type="file"
              className="file-input"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

          </div>



          <div className="post-form-section">


            <div className="post-user">

              <img
                src={user?.profile_picture}
                alt="Profile"
              />

              <div>

                <h3>
                  {user?.username}
                </h3>

                <p>
                 {user?.email}
                </p>

              </div>

            </div>


            <textarea
              placeholder="Write a caption..."
              maxLength={500}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            ></textarea>


            <div className="post-options">



             

            </div>

          </div>

        </div>

      </div>

    </div>
        
</div>
  );
}

export default CreatePostPage;