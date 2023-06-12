import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Post from './pages/Post';
import MyPost from './pages/MyPost';
import LikedPost from './pages/LikedPost';
import Blog from './pages/Blog';
import Search from './pages/Search';

const App = () => {
  const [isAuth, setIsAuth] = useState(false);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/createblog" element={<Post />} />
        <Route path="/myblogs" element={<MyPost />} />
        <Route path="/likedblogs" element={<LikedPost />} />
        <Route path="/search" element={<Search />} />
        <Route path="/blog/:id" element={<Blog />} />
      </Routes>
    </Router>
  );
};

export default App;