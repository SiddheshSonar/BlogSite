import { React, useState, useEffect } from 'react';
import NavB from './NavB';
import { useLocation } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import WestIcon from '@mui/icons-material/West';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { updateDoc, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../Firebase-config';
import toast, { Toaster } from 'react-hot-toast';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import moment from 'moment';


const Blog = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const post = location.state.post;
  const creationTime = formatDate(post.author.creationTime);
  const [liked, setLiked] = useState(false);
  const [noOfLikes, setNoOfLikes] = useState(post.likes);
  console.log(post.likes)

  if (localStorage.getItem('isAuth') === 'false') {
    window.location.href = '/';
  }

  useEffect(() => {
    const postRef = doc(db, 'posts', post.id);
    const unsubscribe = onSnapshot(postRef, (snapshot) => {
      const postData = snapshot.data();
      if (postData) {
        setNoOfLikes(postData.likes);
        setLiked(postData.likedBy.includes(auth.currentUser.uid));
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [post.id]);

  function formatDate(dateString) {
    const date = moment(dateString, ['MM/DD/YYYY HH:mm:ss A', 'DD/MM/YYYY HH:mm:ss A', 'YYYY-MM-DD HH:mm:ss A']);
    const formattedDate = date.format('MMMM D, YYYY, h:mm A');
    return formattedDate;
  }

  const handleLike = async () => {
    try {
      const postRef = doc(db, 'posts', post.id);
      const userRef = doc(db, 'users', auth.currentUser.uid);

      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const likedPosts = userData.likedPosts || [];

        if (likedPosts.includes(post.id) || post.likedBy.includes(auth.currentUser.uid)) {
          toast.error('You have already liked this post');
          return;
        }

        const updatedLikedBy = [...post.likedBy, auth.currentUser.uid];

        await updateDoc(postRef, {
          likes: post.likes + 1,
          likedBy: updatedLikedBy,
        });

        await updateDoc(userRef, {
          likedPosts: [...likedPosts, post.id],
        });
        toast.success('Added to Liked Blogs');
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
          await updateDoc(postRef, {
            likes: Math.max(post.likes - 1, 0),
            likedBy: post.likedBy.filter((userId) => userId !== auth.currentUser.uid),
          });

          const updatedLikedPosts = likedPosts.filter((postId) => postId !== post.id);
          await updateDoc(userRef, {
            likedPosts: updatedLikedPosts,
          });
          toast.error('Removed from Liked Blogs');
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
      <Toaster />
      {loading ? (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <div className='blog-page'>
          <div className='blog-container'>
            <div className='blog-info'>
              <div className='view-head'>
                <IconButton onClick={handleBack}>
                  <WestIcon 
                  sx={{ 
                    fontSize: '2.2rem', 
                    '@media(max-width:420px)' : {
                      fontSize: '1.8rem'
                    }}} 
                    />
                </IconButton>
                <h1 className='view-title'>{post.title}</h1>
                {liked ? (
                  <IconButton onClick={handleUnlike}>
                    <FavoriteIcon sx={{ fontSize: '2.2rem', color: "red", '@media(max-width:420px)' : {
                      fontSize: '1.8rem'
                    } }} />
                    {noOfLikes}
                  </IconButton>
                ) : (
                  <IconButton onClick={handleLike}>
                    <FavoriteBorderOutlinedIcon sx={{ fontSize: '2.2rem', '@media(max-width:420px)' : {
                      fontSize: '1.8rem'
                    }}} />
                    {noOfLikes}
                  </IconButton>
                )}
              </div>
              <div className='view-body'>
                {post.image.url && (
                  <div className='blog-img'>
                    <img alt='Blog' src={post.image.url} className='view-image' />
                  </div>
                )}
                <div className='view-content' dangerouslySetInnerHTML={{ __html: post.content }} />
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
      )}
    </div>
  );
};

export default Blog;
