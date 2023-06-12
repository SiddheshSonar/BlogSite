import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Logo from '../assets/react.svg';
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase-config';
import LogoutIcon from '@mui/icons-material/Logout';
import '../App.css';

function NavB() {
  const handleLogout = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      localStorage.setItem('isAuth', false);
    });
    window.location.pathname = '/login';
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed='top' style={{ marginBottom: '1rem' }}>
      <Container>
        <Navbar.Brand className="nav-title" onClick={() => {window.location.pathname = '/home'}} style={{cursor: "pointer"}}>
          <img
            alt="Logo"
            src={Logo}
            width="30"
            height="30"
            className="logo-image d-inline-block align-top"
          />{' '}
          BlogsPress
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => {window.location.pathname = '/home'}}>Home</Nav.Link>
            <Nav.Link onClick={() => {window.location.pathname = '/myblogs'}}>My Blogs</Nav.Link>
            <Nav.Link onClick={() => {window.location.pathname = '/likedblogs'}}>Liked Blogs</Nav.Link>
            <Nav.Link onClick={() => {window.location.pathname = '/search'}}>Search Blogs</Nav.Link>
            <Nav.Link onClick={() => {window.location.pathname = '/createblog'}}>Create Blog</Nav.Link>
            <NavDropdown className="avatar-dropdown" id="collasible-nav-dropdown" title={auth.currentUser?.photoURL && <img
              alt="Account"
              src={auth.currentUser?.photoURL}
              width="30"
              height="30"
              className="avatar-image"
            />}>
              <NavDropdown.Item className='logout-btn'
                onClick={handleLogout}
              >
                <LogoutIcon /> <div style={{marginLeft: "0.4rem"}}>Logout</div>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavB;
