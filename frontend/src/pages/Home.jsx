import React from 'react';
import NavB from './NavB';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase-config';
import PostCard from './Card';

const Home = () => {
    const [postList, setPostList] = useState([]);
    const postRef = collection(db, 'posts');

    useEffect(() => {
        const getPosts = async () => {
            const data = await getDocs(postRef);
            setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        }
        getPosts();
    }, []);

    const postElements = postList.map((post) => {
        return <PostCard post={post} />
    });

    if (localStorage.getItem('isAuth') === 'false') {
        window.location.href = '/login';
    }
    else {
        return (
            <div>
                <NavB />
                <div className="home-page">
                    <div className="post-container">{postElements}</div>
                </div>
            </div>
        );
    }
};

export default Home;
