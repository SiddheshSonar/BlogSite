import { React, useState, useEffect } from 'react';
import NavB from './NavB';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../Firebase-config';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import PostCard from './Card';

const MyPost = () => {
    const postRef = collection(db, 'posts');
    const [postList, setPostList] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log(postList)

    useEffect(() => {
        const getPosts = async () => {
            const data = await getDocs(postRef);
            setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            setLoading(false);
        }
        getPosts();
    }, []);


    const displayPosts = postList.map((post) => {
        console.log(post.author.email)
        console.log(auth.currentUser?.email)
        if (post.author.id === auth.currentUser?.uid) {
            return <PostCard post={post} key={post.id}/>
    }
    });

    if (localStorage.getItem('isAuth') === 'false') {
        window.location.href = '/login';
    }

    return (
        <div>
            <NavB />
            <div className='home-page'>
                <h1 className='mypost-title'>My Blogs</h1>
                {loading && <Box sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%,-50%)"
                    }}>
                        <CircularProgress />
                    </Box>}
                {displayPosts.length === 0 && <h1 className='no-title'>Don't keep your ideas to yourself <a href='/createblog' style={{textDecoration: "none"}}>Start blogging!</a></h1>}
                <div>{displayPosts}</div>
            </div>
        </div>
    );
};

export default MyPost;