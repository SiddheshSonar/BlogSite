import { React, useState, Fragment } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { db, auth } from '../Firebase-config';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EastIcon from '@mui/icons-material/East';
import { deleteDoc, doc } from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';


function PostCard({ post }) {
    const navigate = useNavigate();
    const creationTime = formatDate(post.author.creationTime);
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    console.log(auth.currentUser?.photoURL)

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 475,
        bgcolor: 'background.paper',
        borderRadius: "1rem",
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        const month = date.toLocaleString('default', { month: 'long' });
        const day = date.getDate();
        const year = date.getFullYear();
        const time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

        return `${month} ${day}, ${year}, ${time}`;
    }

    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
      );

    const handleCardClick = () => {
        navigate(`/blog/${post.id}`, { state: { post } });
    };

    const handleDelete = async (id) => {
        const postDoc = doc(db, 'posts', id);
        await deleteDoc(postDoc);
        toast.success('Post deleted successfully!');
        await delay(1000)
        window.history.back();   
        setOpen(false);
    }

    return (
        <Card sx={{ width: "35rem", maxHeight: "auto", margin: "1rem", border: "1px black", "&:hover": { boxShadow: "0 0 10px 5px #ccc", backgroundColor: "#F5F5F5" } }}>
            <Fragment>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="child-modal-title"
                    aria-describedby="child-modal-description"
                >
                    <Box sx={{ ...style }}>
                        <h5 style={{fontWeight: "700"}} id="child-modal-title">Are you sure you want to delete this post?</h5>
                        <div style={{display: "flex", flexDirection:"row", justifyContent: "space-evenly", marginTop: "1rem"}}>
                            <button className='btn btn-danger' onClick={() => { handleDelete(post.id) }}>Confirm</button>
                            <button className='btn btn-primary' onClick={handleClose}>Cancel</button>
                        </div>
                    </Box>
                </Modal>
            </Fragment>
            <Toaster />
            <CardHeader
                avatar={
                    <img
                        alt="Profile"
                        src={post.author.photo}
                        width="40rem"
                        className="user-image"
                    />
                }
                action={
                    <div>
                        <IconButton onClick={handleCardClick} aria-label="like-btn">
                            <EastIcon sx={{ fontSize: "2rem" }} />
                        </IconButton>
                        {(post.author.id === auth.currentUser?.uid) ?
                            <IconButton onClick={handleOpen} aria-label="like-btn">
                                <DeleteIcon sx={{ fontSize: "2rem" }} />
                            </IconButton> : null
                        }
                    </div>
                }
                title={post.author.name}
                titleTypographyProps={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                }}
                subheader={creationTime}
            />
            <hr style={{ width: "100%", color: "black", height: "1px", backgroundColor: "black", margin: "0" }} />
            <CardContent onClick={handleCardClick} sx={{ cursor: "pointer" }}>
                <h5 className='blog-title'>
                    {post.title}
                </h5>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
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
                {post.searchTag != 0 && <div className='tag-section'>
                    <h6 className='tag-head'>Tags: </h6>
                    <div className='blog-tags'>
                        {post.searchTag.map((tag) => {
                            return <p className='tag'>#{tag}</p>;
                        })}
                    </div>
                </div>}
            </CardContent>
        </Card>
    );
}

export default PostCard;