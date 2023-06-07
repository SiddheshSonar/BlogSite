import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { auth } from '../Firebase-config';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

function PostCard({ post }) {
    const creationTime = formatDate(post.author.creationTime);

    function formatDate(dateString) {
        const date = new Date(dateString);
        const month = date.toLocaleString('default', { month: 'long' });
        const day = date.getDate();
        const year = date.getFullYear();
        const time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

        return `${month} ${day}, ${year}, ${time}`;
    }


    return (
        <Card className='post-card' sx={{ width: "40rem", height: "auto", margin: "1rem", border: "1px black" }}>
            <CardHeader
                avatar={
                    <img
                  alt="Profile"
                  src={auth.currentUser?.photoURL}
                  width="50rem"  
                  className="user-image"
                />
                }
                action={
                    <IconButton aria-label="like-btn">
                        <FavoriteIcon sx={{fontSize: "2.2rem"}}/>
                    </IconButton>
                }
                title={post.author.name}
                titleTypographyProps={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}  
                subheader={creationTime}
            />
            <hr style={{ width: "100%", color: "black", height: "1px", backgroundColor: "black", margin: "0" }} />
            <CardContent>
                <h5 className='blog-title'>
                    {post.title}
                </h5>
                {post.image.url && (
                    <CardMedia
                        component="img"
                        className='blog-image'
                        image={post.image.url}
                        alt="image here"
                    />
                )}
                <p className='blog-content'>
                    {post.content}
                </p>
            </CardContent>
        </Card>
    );
}

export default PostCard;