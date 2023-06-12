import {React, useState} from 'react';
import NavB from './NavB';
import Tags from '../data/Tags';
import Select from 'react-select';

const Search = () => {
    const [selectedTags, setSelectedTags] = useState([]);

    const handleTagChange = (selectedOptions) => {
        setSelectedTags(selectedOptions);
      };
    


    return (
        <div>
            <NavB />
            <div className='search-page'>
                <h2>
                    Search Blogs
                </h2>
                <div>
                    {selectedTags.map((tag) => {
                        return <p>{tag.value}</p>;
                    })
                    }
                </div>
                <Select
            isMulti
            name="tags"
            options={Tags}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleTagChange}
          />
                <img className='search-img' src="https://img.freepik.com/free-vector/organic-flat-blog-post-illustration-with-people_23-2148955260.jpg" alt="image here" />
            </div>
        </div>
    );
};

export default Search;