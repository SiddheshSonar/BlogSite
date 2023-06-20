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
import { doc, deleteDoc, arrayRemove, collection, getDocs, query, where, updateDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import toast, { Toaster } from 'react-hot-toast';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import moment from 'moment';

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

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 475,
    bgcolor: 'background.paper',
    borderRadius: '1rem',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
    '@media (max-width: 600px)': {
      width: '90%',
      maxHeight: '90%',
    },
  };

  function formatDate(dateString) {
    const date = moment(dateString, ['MM/DD/YYYY HH:mm:ss A', 'DD/MM/YYYY HH:mm:ss A', 'YYYY-MM-DD HH:mm:ss A']);
    const formattedDate = date.format('MMMM D, YYYY, h:mm A');
    return formattedDate;
  }

  const delay = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleCardClick = () => {
    navigate(`/blog/${post.id}`, { state: { post } });
  };

  const storage = getStorage();

  const handleDelete = async (id) => {
    const postDocRef = doc(db, 'posts', id);
    const usersCollectionRef = collection(db, 'users');

    try {
      const postSnapshot = await getDoc(postDocRef);
      const postData = postSnapshot.data();

      await deleteDoc(postDocRef);
      toast.success('Blog deleted successfully!');

      if (postData?.image?.url) {
        const imageRef = ref(storage, postData.image.url);
        await deleteObject(imageRef);
      }

      const usersSnapshot = await getDocs(
        query(usersCollectionRef, where('likedPosts', 'array-contains', id))
      );

      const updatePromises = usersSnapshot.docs.map((userDoc) => {
        const userRef = doc(usersCollectionRef, userDoc.id);
        return updateDoc(userRef, {
          likedPosts: arrayRemove(id),
        });
      });

      await Promise.all(updatePromises);

      await delay(1000);
      window.location.reload();
      setOpen(false);
    } catch (error) {
      console.error('Error deleting Blog:', error);
      toast.error('Failed to delete Blog.');
    }
  };

  const splitAndSliceContent = (content, limit) => {
    const words = content.split(' ');
    const slicedContent = words.slice(0, limit).join(' ');
    const ellipsis = words.length > limit ? '...' : '';
    return `${slicedContent}${ellipsis}`;
  };

  return (
    <Card
      sx={{
        width: '35rem',
        maxHeight: 'auto',
        margin: '1rem',
        border: '1px black',
        '&:hover': { boxShadow: '0 0 10px 5px #ccc', backgroundColor: '#F5F5F5' },
        '@media (max-width: 600px)': {
          width: '25rem',
        },
        '@media (max-width: 420px)': {
          width: '20rem',
        },
      }}
    >
      <Fragment>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box sx={{ ...style }}>
            <h5 style={{ fontWeight: '700' }} id="child-modal-title">
              Are you sure you want to delete this post?
            </h5>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginTop: '1rem',
              }}
            >
              <button
                className="btn btn-danger"
                onClick={() => {
                  handleDelete(post.id);
                }}
              >
                Confirm
              </button>
              <button className="btn btn-primary" onClick={handleClose}>
                Cancel
              </button>
            </div>
          </Box>
        </Modal>
      </Fragment>
      <Toaster />
      <CardHeader
        avatar={
          post.author.photo ? (
            <Avatar
              alt="Profile"
              src={post.author.photo}
              sx={{ width: 40, height: 40 }}
            />
          ) : null
        }
        action={
          <div>
            <IconButton onClick={handleCardClick} aria-label="like-btn">
              <EastIcon
                sx={{
                  fontSize: '2rem',
                  '@media (max-width: 600px)': {
                    fontSize: '1.7rem',
                  },
                }}
              />
            </IconButton>
            {post.author.id === auth.currentUser?.uid ? (
              <IconButton onClick={handleOpen} aria-label="like-btn">
                <DeleteIcon
                  sx={{
                    fontSize: '2rem',
                    '@media (max-width: 600px)': {
                      fontSize: '1.7rem',
                    },
                  }}
                />
              </IconButton>
            ) : null}
          </div>
        }
        title={post.author.name}
        titleTypographyProps={{
          fontWeight: 'bold',
          fontSize: '1rem',
        }}
        subheader={creationTime}
        subheaderTypographyProps={{
          '@media (max-width: 600px)': {
            fontSize: '0.5rem',
          },
        }}
      />
      <hr
        style={{
          width: '100%',
          color: 'black',
          height: '1px',
          backgroundColor: 'black',
          margin: '0',
        }}
      />
      <CardContent onClick={handleCardClick} sx={{ cursor: 'pointer' }}>
        <h5 className="blog-title">{post.title}</h5>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <div>
            
          <p className="blog-card-content" dangerouslySetInnerHTML={{ __html: splitAndSliceContent(post.content, 10) }} />
          {post.searchTag != 0 && (
          <div className="tag-section">
            <h6 className="tag-head">Tags: </h6>
            <div className="blog-tags">
              {post.searchTag.map((tag) => {
                return <p className="tag-card">#{tag}</p>;
              })}
            </div>
          </div>
        )}
          </div>
          {post.image.url && (
            <CardMedia
              component="img"
              className="blog-image"
              image={post.image.url}
              alt="image here"
              sx={{ width: '7rem', height: '7rem', borderRadius: '0.5rem', objectFit: "cover" }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default PostCard;
