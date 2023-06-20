import { React, useState, useEffect } from 'react';
import NavB from './NavB';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../Firebase-config';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import PostCard from './Card';

const LikedPost = () => {
    const postRef = collection(db, 'posts');
    const [postList, setPostList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getPosts = async () => {
            const data = await getDocs(postRef);
            setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            setLoading(false);
        }
        getPosts();
    }, []);

    const likedPosts = postList.map((post) => {
         if(post.likedBy.includes(auth.currentUser?.uid)) {
                return <PostCard post={post} key={post.id}/>
         }
    });


    return (
        <div>
            <NavB />
            <div className='home-page'>
                <h1 className='mypost-title'>Liked Blogs</h1>
                {loading && <Box sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%,-50%)"
                    }}>
                        <CircularProgress />
                    </Box>}
                {likedPosts.length === 0 && <h1 className='no-title'>No Liked Blogs :( <a href='/home' style={{textDecoration: "none"}}>Start adding Blogs you adore!</a></h1>}
                <div>{likedPosts}</div>
            </div>
        </div>
    );
};

export default LikedPost;