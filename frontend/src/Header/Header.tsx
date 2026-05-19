import { useEffect } from "react";
import "./header.css";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  
  const navigate = useNavigate()

    const fetchDataAccount = async() =>
    {
        const data = await fetch("http://localhost:3001/api/auth/verify",
          {
            credentials: "include"
          }
        )
        if(data.status != 200)
        {
            navigate("/login")
        }
        else
        {
          navigate("/account")
        }

      }
     const LogOut = async () =>
     {
        const data = await fetch("http://localhost:3001/api/auth/logout",
          {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
          })
          if(data.status === 204)
          {
            navigate("/login")
          }
     }

  
  
  return (
    <header className="header">



      <div className="header-logo">
        Instagram
      </div>



      <nav className="header-nav">

        <Link to="/" className="nav-link" >
          <i className="fa-solid fa-house"></i>
          Home
        </Link>

        <Link to="/account" className="nav-link" onClick={fetchDataAccount}>
          <i className="fa-solid fa-image"></i>
          Account
        </Link>

        <Link to="/editacc" className="nav-link" onClick={LogOut}>
          <i className="fa-solid fa-user-gear"></i>
          Log Out
        </Link>

      </nav>



    </header>
  );
}

export default Header;