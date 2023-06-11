import { React, useState, useEffect } from 'react';
import NavB from './NavB';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../Firebase-config';
import PostCard from './Card';

const MyPost = () => {
    const postRef = collection(db, 'posts');
    const [postList, setPostList] = useState([]);
    console.log(postList)

    useEffect(() => {
        const getPosts = async () => {
            const data = await getDocs(postRef);
            setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        }
        getPosts();
    }, []);


    const displayPosts = postList.map((post) => {
        console.log(post.author.email)
        console.log(auth.currentUser?.email)
        if (post.author.id === auth.currentUser?.uid) {
            return <PostCard post={post} />
    }
    });

    if (localStorage.getItem('isAuth') === 'false') {
        window.location.href = '/login';
    }

    return (
        <div>
            <NavB />
            <div className='home-page'>
                <h1>My Posts</h1>
                <div>{displayPosts}</div>
            </div>
        </div>
    );
};

export default MyPost;