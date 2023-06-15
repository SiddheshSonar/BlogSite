import React from 'react';
import NavB from './NavB';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../Firebase-config';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import PostCard from './Card';

const Home = () => {
    const [postList, setPostList] = useState([]);
    const [loading, setLoading] = useState(true);
    const postRef = collection(db, 'posts');

    useEffect(() => {
        const getPosts = async () => {
            const data = await getDocs(postRef);
            setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            setLoading(false);
        }
        getPosts();
    }, []);

    const postElements = postList.map((post) => {
        return <PostCard post={post} key={post.id} />;
    });

    if (localStorage.getItem('isAuth') === 'false') {
        window.location.href = '/login';
    } else {
        return (
            <div>
                <NavB />
                <div className="home-page">
                    {loading && (
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
                    )}
                    <div className="post-container">{postElements}</div>
                </div>
            </div>
        );
    }
};

export default Home;
