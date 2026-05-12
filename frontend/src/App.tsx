
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './HomePage/HomePage'
import FollowersPage from './Search/SearchFollowers'
import LoginPage from './HomePage/Login/Login'
import RegisterPage from './HomePage/Register/Register'
import EditProfilePage from './HomePage/EditProfilePage/EditProfilePage'
import AccountPage from './HomePage/AccountPage/AccountPage'

function App() {

  return (
    <BrowserRouter>
        <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/users" element={<FollowersPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/account" element={<AccountPage/>} />
        <Route path="/editacc" element={<EditProfilePage/>} />

      </Routes>
      </BrowserRouter>
  )
}

export default App
