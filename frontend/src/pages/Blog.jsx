import React from 'react';
import NavB from './NavB';
import { useLocation } from 'react-router-dom';

const Blog = () => {
    const location = useLocation();
    const post = location.state.post;
    console.log(post)
    return (
        <div>
            <NavB />
            <div className='blog-page'>
                <div className='blog-container'>
                    <div className='blog-info'>
                        <div className='author-info'>
                            <img
                                alt="Profile"
                                src={post.author.photo}
                                width="40rem"
                                className="author-image"
                            />
                            <div className='author-name'>{post.author.name}</div>
                            <div className='author-date'>{post.author.creationTime}</div>
                        </div>
                    <h1 className='view-title'>{post.title}</h1>
                            <div>
                                <div className='blog-image'>
                                    <img
                                        alt="Blog"
                                        src={post.image.url}
                                        width="100%"
                                        height="100%"
                                        className="blog-image"
                                    />

                                </div>
                                <div className='blog-content'>{post.content}</div>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog;