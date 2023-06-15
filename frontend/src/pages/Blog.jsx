import { React, useState, useEffect } from 'react';
import NavB from './NavB';
import { useLocation } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import WestIcon from '@mui/icons-material/West';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { db, auth, storage } from '../Firebase-config';

const Blog = () => {
  const location = useLocation();
  const post = location.state.post;
  const creationTime = formatDate(post.author.creationTime);
  const [liked, setLiked] = useState(false);
  const [noOfLikes, setNoOfLikes] = useState(post.likes);
  console.log(post.likes)

  if (localStorage.getItem('isAuth') === 'false') {
    window.location.href = '/login';
  }

  useEffect(() => {
    const checkIfLiked = async () => {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const likedPosts = userData.likedPosts || []; 
        setLiked(likedPosts.includes(post.id));
        setNoOfLikes(post.likes);
      }
    };
    checkIfLiked();
  },[])

  function formatDate(dateString) {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    const time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

    return `${month} ${day}, ${year}, ${time}`;
  }

  const handleLike = async () => {
    try {
      const postRef = doc(db, 'posts', post.id);
      const userRef = doc(db, 'users', auth.currentUser.uid);
  
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const likedPosts = userData.likedPosts || []; 

        if (likedPosts.includes(post.id)) {
            alert('You have already liked this post');
            return;
          }

        await updateDoc(postRef, {
          likes: post.likes + 1,
        });
  
        await updateDoc(userRef, {
          likedPosts: [...likedPosts, post.id],
        });
  
        setLiked(true);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleUnlike = async () => {
    try {
      const postRef = doc(db, 'posts', post.id);
      const userRef = doc(db, 'users', auth.currentUser.uid);
  
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const likedPosts = userData.likedPosts || []; 

        if (likedPosts.includes(post.id)) {
          setLiked(true);
            await updateDoc(postRef, {
              likes: Math.max(post.likes - 1, 0),
            });

            const updatedLikedPosts = likedPosts.filter((postId) => postId !== post.id);
            await updateDoc(userRef, {
              likedPosts: updatedLikedPosts,
            });
            
            setLiked(false);
        }
      }
    } catch (error) {
      console.error('Error unliking post:', error);
    }
  };


  const handleBack = () => {
    window.history.back();
  };

  return (
    <div>
      <NavB />
      <div className='blog-page'>
        <div className='blog-container'>
          <div className='blog-info'>
            <div className='view-head'>
              <IconButton onClick={handleBack}>
                <WestIcon sx={{ fontSize: '2.2rem' }} />
              </IconButton>
              <h1 className='view-title'>{post.title}</h1>
              {liked ? (
                <IconButton onClick={handleUnlike}>
                    <FavoriteIcon sx={{ fontSize: '2.2rem' }} />
                    {noOfLikes}
                </IconButton>
                ) : (
                <IconButton onClick={handleLike}>
                    <FavoriteBorderOutlinedIcon sx={{ fontSize: '2.2rem' }} />
                    {noOfLikes}
                </IconButton>
                )
                }
            </div>
            <div className='view-fix'></div>
            <div className='view-body'>
              {post.image.url && (
                <div className='blog-img'>
                  <img alt='Blog' src={post.image.url} className='view-image' />
                </div>
              )}
              <div className='view-content'>{post.content}</div>
            </div>
            <div className='view-foot'>
              <div className='view-tag'>
                {post.tags.map((tag, index) => (
                  <div key={index} className='tag'>
                    #{tag}
                  </div>
                ))}
              </div>
              <div className='author-info'>
                <div className='author-name'>By @{post.author.name}</div>
                <div className='author-date'>{creationTime}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
