import React from 'react';
import NavB from './NavB';
import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../Firebase-config';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Tags from '../data/Tags';
import Select from 'react-select';

const Post = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const delay = ms =>
    new Promise(resolve => setTimeout(resolve, ms));

  let navigate = useNavigate();
  const postRef = collection(db, 'posts');

  const createPost = async () => {
    if (title === '' || content === '') {
      toast.error('Please fill all the fields');
      return;
    } else {
        const currentTime = new Date();
      const creationTime = currentTime.toLocaleString();
      await addDoc(postRef, {
        title: title,
        content: content,
        tags: selectedTags.map(tag => tag.value),
        author: {
          name: auth.currentUser.displayName,
          id: auth.currentUser.uid,
          photo: auth.currentUser.photoURL,
          creationTime: creationTime,
        },
      });

      toast.success('Post created successfully');
      await delay(2000);
      window.location.reload();
    //   navigate('/home');
    }
  };

  if (localStorage.getItem('isAuth') === 'false') {
    window.location.href = '/login';
  }

  const handleTagChange = (selectedOptions) => {
    setSelectedTags(selectedOptions);
  };

  return (
    <div>
      <NavB />
      <div className="post-page">
        <Toaster />
        <h1 className="post-head">Create a Post</h1>
        <div className="post-info">
          <label className="post-labels">Title:</label>
          <input
            placeholder="Title...."
            type="text"
            className="post-title"
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
          <label className="post-labels">Post:</label>
          <textarea
            placeholder="What's on your mind?"
            cols="80"
            rows="15"
            className="post-content"
            onChange={(event) => {
              setContent(event.target.value);
            }}
          ></textarea>
          <label className="post-labels">Tags:</label>
          <Select
            isMulti
            name="tags"
            options={Tags}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleTagChange}
          />
        </div>
        <button className="btn btn-primary submit-post" onClick={createPost}>
          Submit Post
        </button>
      </div>
    </div>
  );
};

export default Post;
