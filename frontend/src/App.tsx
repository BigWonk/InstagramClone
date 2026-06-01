
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './HomePage/HomePage'
import FollowersPage from './Search/SearchFollowers'
import LoginPage from './HomePage/Login/Login'
import RegisterPage from './HomePage/Register/Register'
import EditProfilePage from './HomePage/EditProfilePage/EditProfilePage'
import AccountPage from './HomePage/AccountPage/AccountPage'
import CommentsPage from './HomePage/Comments/Comments'
import CreatePostPage from './HomePage/CreatePostPage/CreatePostPage'
import UserProfilePage from './Search/UserProfilePage'
import ActiveUsersPage from './HomePage/ActiveUsersPage/ActiveUsersPage'
import ChatPage from "./Messages/ChatPage"
import { useEffect, useState } from 'react'
import { io } from "socket.io-client";
import AvalibleChats from './HomePage/AvalibleChats/AvalibleChats'



export const socket =
    io("http://localhost:3001");


function App() {
  const [id, setId] = useState();
  useEffect(() =>
  {
   const fetchData = async() =>
   {
    const response = await fetch("http://localhost:3001/api/auth/me", {
        credentials: "include"
      })
    const data = await response.json()
    setId(data.id)
   }
   fetchData()
    
   
    

  },[])
  useEffect(() =>
  {
    if (id != null) {
      
      socket.emit("addUser", id)
      socket.emit("findUser", id)
    }
  }, [id])

  return (
    
    
    <BrowserRouter>
        <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/users" element={<FollowersPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/account" element={<AccountPage/>} />
        <Route path="/account/edit" element={<EditProfilePage/>} />
        <Route path="/comments" element={<CommentsPage/>} />
        <Route path="/account/post" element={<CreatePostPage/>} />
        <Route path="/accounts" element={<UserProfilePage/>} />
        <Route path="/activeUsers" element={<ActiveUsersPage/>} />
        <Route path="/chatPage" element={<ChatPage/>} />
        <Route path="/chats" element={<AvalibleChats/>} />





      </Routes>
      </BrowserRouter>
  )
}

export default App
