import { useEffect, useState } from "react";
import "./editProfile.css";
import Header from "../../Header/Header";
import { useNavigate } from "react-router-dom";

function EditProfilePage() {

    const[name, setName] = useState("")
     const[pic, setPic] = useState<null | string>(null)
    const [firstEmail, setFirstEmail] = useState("")
     const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
   const [bio, setBio] = useState("")
    const [profile_picture, setProfilePicture] = useState<null | string>("")
  const navigate = useNavigate()
     const FetchData = async() =>
     {
        const data = await fetch("http://localhost:3001/api/users/edit",{
          method: "PUT",
          credentials: "include",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({username, profile_picture, email, bio})
        })
        if(data.status === 200)
        {
          navigate("/")
        }

     }
     useEffect(() =>
         {
             const fetchData = async() =>
             {
                 const data = await fetch("http://localhost:3001/api/auth/me",{
                   credentials: "include"
                 })
                 const json = await data.json()
                 setName(json.username)
                 setPic(json.profile_picture)
                 setFirstEmail(json.email)
             }
             fetchData()
         },[])
     
  
  
  return (
    <div>
      <Header></Header>
    
    <div className="edit-page">

      <div className="edit-container">


        <div className="edit-header">

          <h1>
            Edit Profile
          </h1>

          <button onClick={FetchData}>
            Save Changes
          </button>

        </div>


        <div className="profile-section">

          <img
            src={pic}
            alt="Profile"
            className="profile-image"
          />

          <div className="profile-info">

            <h3>
              {name}
            </h3>

          </div>

          

        </div>

        <form className="edit-form">

          <div className="input-group">

            <label>
              Profile picture link
            </label>

            <input
              type="text"
              placeholder="image link"
              value={profile_picture}
              onChange={(e) => setProfilePicture(e.target.value)}
            />

          </div>
          <div className="input-group">

            <label>
              Username
            </label>

            <input
              type="text"
              placeholder={name}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

          </div>

          <div className="input-group">

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder={firstEmail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              
            />

          </div>

          <div className="input-group">

            <label>
              Bio
            </label>

            <textarea
              placeholder="Tell people about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            ></textarea>


          </div>
          
        

          
        </form>
        
      </div>

    </div>
    </div>
  );
}

export default EditProfilePage;