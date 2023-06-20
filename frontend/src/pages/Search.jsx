import React, { useState, useEffect } from 'react';
import NavB from './NavB';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../Firebase-config';
import PostCard from './Card';
import Tags from '../data/Tags';
import Select from 'react-select';

const Search = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const postRef = collection(db, 'posts');
  const [postList, setPostList] = useState([]);
  const [searchedPosts, setSearchedPosts] = useState([]);
  const [isSearch, setIsSearch] = useState(false);

  if (localStorage.getItem('isAuth') === 'false') {
    window.location.href = '/';
  }

  const handleTagChange = (selectedOptions) => {
    setSelectedTags(selectedOptions);
  };

  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postRef);
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getPosts();
  }, []);

  useEffect(() => {
    const filteredPosts = postList.filter((post) => {
      return selectedTags.some((tag) => post.searchTag.includes(tag.value));
    });
    setSearchedPosts(filteredPosts);
    setIsSearch(selectedTags.length > 0 && filteredPosts.length > 0);
  }, [selectedTags, postList]);

  const displaySearchPosts = searchedPosts.map((post) => (
    <PostCard post={post} key={post.id} />
  ));

  return (
    <div>
      <NavB />
      <div className="search-page">
        <h1 className='search-title'>Search Blogs</h1>
        <Select
          isMulti
          name="tags"
          options={Tags}
          className="basic-multi-select search-select"
          classNamePrefix="select"
          placeholder="Search by tags...."
          onChange={handleTagChange}
        />
        {isSearch ? (
          <div className="home-page">
            <h2 className="result-title">Search Results</h2>
            <div>{displaySearchPosts}</div>
          </div>
        ) : (
          <div className="home-page">
            {selectedTags.length === 0 && (
              <div className="no-search">
                <img
                  className="search-img"
                  src="https://img.freepik.com/free-vector/organic-flat-blog-post-illustration-with-people_23-2148955260.jpg"
                  alt="image here"
                />
              </div>
            )}
            {selectedTags.length > 0 && (
              <div className="no-search">
                <h1 className="result-title">Search Results</h1>
                <h2 className='no-text1'>No results found :(</h2>
                <h3 className='no-text2'>Please try some other tags</h3>
                <img 
                className="no-img"
                src="https://cdni.iconscout.com/illustration/premium/thumb/error-404-4344461-3613889.png" 
                alt="image here" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
