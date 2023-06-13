import React from 'react';
import NavB from './NavB';
import { useLocation } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import WestIcon from '@mui/icons-material/West';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';


const Blog = () => {
    const location = useLocation();
    const post = location.state.post;
    const creationTime = formatDate(post.author.creationTime);

    function formatDate(dateString) {
        const date = new Date(dateString);
        const month = date.toLocaleString('default', { month: 'long' });
        const day = date.getDate();
        const year = date.getFullYear();
        const time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

        return `${month} ${day}, ${year}, ${time}`;
    }

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
                            <IconButton>
                                <WestIcon onClick={handleBack} sx={{fontSize: "2.2rem"}}/>
                            </IconButton>
                            <h1 className='view-title'>{post.title}</h1>
                            <IconButton>
                                <FavoriteBorderOutlinedIcon sx={{fontSize: "2.2rem"}}/>
                            </IconButton>
                        </div>
                        <div className='view-fix'>

                        </div>
                        <div className='view-body'>
                        {post.image.url &&<div className='blog-img'>
                                 <img
                                    alt="Blog"
                                    src={post.image.url}
                                    className="view-image"
                                />
                            </div>}
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