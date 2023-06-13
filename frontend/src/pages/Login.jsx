import { React, useState } from 'react';
import { auth, provider } from '../Firebase-config';
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import '../App.css';

function Login({ setIsAuth }) {
  let navigate = useNavigate();

  if (localStorage.getItem('isAuth') === 'true') {
    window.location.href = '/home';
  }
  const signIn = () => {
    signInWithPopup(auth, provider).then((result) => {
      setIsAuth(true);
      localStorage.setItem('isAuth', true);
      navigate('/home');
      let user = result.user;
      console.log(user);
    }).catch((error) => {
      localStorage.setItem('isAuth', false);
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
  }

  return (
    <div className='login-container'>
      <h1 className='login-title'>BlogsPress</h1>
      <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" className="img-fluid" alt="image here" />
      <div className="sign-container justify-content-center align-items-center my-2">
        <p className='signIn'>Sign in with Google</p>
        <div className='text-center text-md-start pt-2'>
          <button className="" size='lg' onClick={signIn}><GoogleIcon style={{}} />Sign In</button>
        </div>
      </div>
    </div>
  );
}

export default Login;