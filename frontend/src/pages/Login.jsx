import { React, useState } from 'react';
import { auth, provider, db } from '../Firebase-config';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import Logo from "../assets/logo.png"
import '../App.css';

function Login({ setIsAuth }) {
  const userRef = collection(db, 'users');

  let navigate = useNavigate();

  if (localStorage.getItem('isAuth') === 'true') {
    window.location.href = '/home';
  }
  const signInWithGoogle = async () => {
    try {
      const userInfo = await signInWithPopup(auth, provider)
      setIsAuth(true);
      localStorage.setItem('isAuth', true);
      navigate('/home');
      const userDocRef = doc(db, 'users', userInfo.user.uid);
      const userDoc = await getDoc(userDocRef);
  
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          name: userInfo.user.displayName,
          id: userInfo.user.uid,
          email: userInfo.user.email,
          likedPosts: []
        });
      }
      console.log(userInfo);
    } catch (error) {
      localStorage.setItem('isAuth', false);
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    }
  }

  return (
    <div className='login-container'>
      <h1 className='login-title'>
      BlogsPress
      <img 
      src={Logo}
      alt="" 
      width="60px"/>
      </h1>
      <div className='img-btn'>
      <img src="https://img.freepik.com/premium-vector/blog-authors-writing-articles_179970-1523.jpg?w=900" className="img-fluid" alt="image here" />
      <div className="sign-container justify-content-center align-items-center my-2">
        <h2 className='sign-title'>Begin Your Blogging Journey ;)</h2>
        <p className='signIn'>Sign In with Google</p>
        <div className='text-center text-md-start pt-2'>
          <button className="btn btn-light sign-btn" size='lg' onClick={signInWithGoogle}>
            <img 
            src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" 
            alt="G"
            width='35'
            className='google-icon'
             />
            Sign In</button>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Login;