import React from 'react';
import NavB from './NavB';

const Post = () => {
    if (localStorage.getItem('isAuth') === 'false') {
        window.location.href = '/login';
    }
    return (
        <div>
            <NavB/>
            Post Page
        </div>
    );
};

export default Post;