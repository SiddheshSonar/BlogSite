import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { auth } from '../Firebase-config';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import EastIcon from '@mui/icons-material/East';

function PostCard({ post }) {
    const navigate = useNavigate();
    const creationTime = formatDate(post.author.creationTime);

    function formatDate(dateString) {
        const date = new Date(dateString);
        const month = date.toLocaleString('default', { month: 'long' });
        const day = date.getDate();
        const year = date.getFullYear();
        const time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

        return `${month} ${day}, ${year}, ${time}`;
    }

    const handleCardClick = () => {
        navigate(`/blog/${post.id}`, { state: { post } });
      };
      

    return (
        <Card onClick={handleCardClick} sx={{ width: "35rem", maxHeight: "16rem", margin: "1rem", border: "1px black", cursor: "pointer" ,"&:hover": { boxShadow: "0 0 10px 5px #ccc", backgroundColor: "#F5F5F5"} }}>
            <CardHeader
                avatar={
                    <img
                  alt="Profile"
                  src={auth.currentUser?.photoURL}
                  width="40rem"  
                  className="user-image"
                />
                }
                action={
                    <IconButton aria-label="like-btn">
                        <EastIcon sx={{fontSize: "2rem"}}/>
                    </IconButton>
                }
                title={post.author.name}
                titleTypographyProps={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                  }}  
                subheader={creationTime}
            />
            <hr style={{ width: "100%", color: "black", height: "1px", backgroundColor: "black", margin: "0" }} />
            <CardContent>
                <h5 className='blog-title'>
                    {post.title}
                </h5>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <p className='blog-content'>
                    {post.content.split(" ").slice(0, 10).join(" ")}...{" "}
                </p>
                {post.image.url && (
                    <CardMedia
                        component="img"
                        className='blog-image'
                        image={post.image.url}
                        alt="image here"
                        sx={{ width: "6rem", height: "6rem", marginTop: "-2rem", borderRadius: "0.5rem" }}
                    />
                )}
                </div>
            </CardContent>
        </Card>
    );
}

export default PostCard;