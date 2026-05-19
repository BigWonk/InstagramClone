
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

function App() {

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


      </Routes>
      </BrowserRouter>
  )
}

export default App
