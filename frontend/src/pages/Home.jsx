import React from 'react';
import NavB from './NavB';

const Home = () => {
    if (localStorage.getItem('isAuth') === 'false') {
        window.location.href = '/login';
    }
    else {
        return (
            <div>
                <NavB/>
                Home Page
            </div>
        );
    }
};

export default Home;