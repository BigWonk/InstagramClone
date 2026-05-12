import { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
   const [error, setError] = useState("")
   const navigate = useNavigate()

  const handleSubmit = async(e) =>
  
    {
      e.preventDefault()
      const data = await fetch ("http://localhost:3001/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({username,password})
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
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
            alt="Social Media"
          />
        </div>

        <div className="login-right">
          <div className="login-card">
            <h1 className="logo">Instagram</h1>

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

    </div>
  );
}

export default LoginPage;