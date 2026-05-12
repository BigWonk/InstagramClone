import { useState } from "react";
import "./register.css";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  
  const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [profile_picture, setProfilePic] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const handleSubmit = async (e) =>
 
    {
      e.preventDefault()
      if(!email || !username || !password || !profile_picture)
    {
      setError("Please give a value to all fields")
    }
    const data = await fetch("http://localhost:3001/api/auth/register",
        {method: "POST",
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username, email, password, profile_picture})
      })
      const json = await data.json()
      if(data.status === 404)
      {
        setError(json.message);
      }
      else
      {
          navigate("/")
      }
  }

  return (
    <div className="register-page">

      <div className="register-box">

        <h1 className="register-logo">
          Instagram
        </h1>

        <p className="register-subtitle">
          Sign up to connect with friends and share moments.
        </p>

        <form className="register-form" onSubmit={handleSubmit}>

            <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
            <input
            type="text"
            placeholder="Profile pic"
            value={ profile_picture}
            onChange={(e) => setProfilePic(e.target.value)}
            required
          />


          <button type="submit">
            Sign Up
          </button>
          <h3>{error}</h3>
        </form>


        

        <p className="terms">
          By signing up, you agree to our Terms,
          Privacy Policy and Cookies Policy.
        </p>

      </div>

      <div className="login-redirect">

        <p>
          Already have an account?
        </p>

        <a href="/login">
          Log in
        </a>

      </div>

    </div>
  );
}

export default RegisterPage;