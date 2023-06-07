import { React, useState } from 'react';
import NavB from './NavB';
import { auth } from '../Firebase-config';

const MyPost = () => {
    return (
        <div>
            <NavB />
            <div>
                {auth.currentUser?.photoURL}
            </div>
        </div>
    );
};

export default MyPost;