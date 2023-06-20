import React, { useState, useEffect } from 'react';
import NavB from './NavB';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../Firebase-config';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Tags from '../data/Tags';
import Select from 'react-select';
import UploadIcon from '@mui/icons-material/Upload';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Post = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [image, setImage] = useState(null);

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  const navigate = useNavigate();
  const postRef = collection(db, 'posts');

  useEffect(() => {
    if (localStorage.getItem('isAuth') === 'false') {
      navigate('/login');
    }
  }, [navigate]);

  const createPost = async () => {
    if (title === '' || content === '' || selectedTags.length === 0) {
      toast.error('Please fill all the required fields');
      return;
    } else {
      const currentTime = new Date();
      const creationTime = currentTime.toLocaleString();
      let imageURL = null;
      if (image) {
        const imageRef = ref(storage, `images/${title}-${currentTime.getTime()}`);
        await uploadBytes(imageRef, image);
        imageURL = await getDownloadURL(imageRef);
      }
      await addDoc(postRef, {
        title: title,
        content: content,
        searchTag: selectedTags.map(tag => tag.value),
        tags: selectedTags.map(tag => tag.label),
        likes: 0,
        likedBy: [],
        author: {
          name: auth.currentUser.displayName,
          id: auth.currentUser.uid,
          photo: auth.currentUser.photoURL,
          creationTime: creationTime,
        },
        image: {
          url: imageURL,
          required: false,
        },
      });

      toast.success('Blog created successfully!');
      await delay(2000);
      window.location.reload();
    }
  };

  const handleTagChange = (selectedOptions) => {
    setSelectedTags(selectedOptions);
  };

  return (
    <div>
      <NavB />
      <div className="post-page">
        <Toaster/>
        <div className='p-container'>
          <h1 className="post-head">Create a Blog</h1>
          <div className="post-info">
            <label className="post-labels">Title<span className='required'>*</span>:</label>
            <input
              placeholder="Title...."
              type="text"
              className="post-title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            />
            <label className="post-labels">Post<span className='required'>*</span>:</label>
            <ReactQuill
              theme="snow"
              className="post-content"
              placeholder="What's on your mind?"
              value={content}
              onChange={(value) => {
                setContent(value);
              }}
            />
            <label className="post-labels">Image:</label>
            <input
              type="file"
              accept='image/*'
              className="post-image"
              onChange={(event) => {
                setImage(event.target.files[0]);
              }}
            />
            <label className="post-labels">Tags<span className='required'>*</span>:</label>
            <Select
              isMulti
              name="tags"
              options={Tags}
              className="basic-multi-select post-select"
              classNamePrefix="select"
              value={selectedTags}
              onChange={handleTagChange}
            />
          </div>
          <button className="btn btn-primary submit-post" onClick={createPost}>
            Post Blog <UploadIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
