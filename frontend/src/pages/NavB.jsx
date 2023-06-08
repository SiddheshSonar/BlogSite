import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Logo from '../assets/react.svg';
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase-config';
import '../App.css';
import LogoutIcon from '@mui/icons-material/Logout';

function NavB() {
  const handleLogout = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      localStorage.setItem('isAuth', false);
    });
    window.location.pathname = '/login';
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" style={{ marginBottom: '1rem' }}>
      <Container>
        <Navbar.Brand className="nav-title" href="./home">
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
            <Nav.Link href="./home">Home</Nav.Link>
            <Nav.Link href="./myposts">My Blogs</Nav.Link>
            <Nav.Link href="./likedposts">Liked Blogs</Nav.Link>
            <Nav.Link href="./post">Create Blog</Nav.Link>
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
