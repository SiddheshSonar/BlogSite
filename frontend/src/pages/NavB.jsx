import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Logo from "../assets/react.svg";
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase-config';

function NavB() {
  const handleLogout = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      localStorage.setItem('isAuth', false);
    })
    window.location.pathname = '/login';
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" style={{ marginBottom: "1rem" }}>
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
            <Nav.Link href="./myposts">My Posts</Nav.Link>
            <Nav.Link href="./likedposts">Liked Posts</Nav.Link>
            <Nav.Link href="./post">Create Post</Nav.Link>
            <NavDropdown
              id="collasible-nav-dropdown"
              title={
                <img
                  alt="Account"
                  src={auth.currentUser?.photoURL}
                  width="30"
                  height="30"
                  className="avatar-image"
                />
              }
            >
              <NavDropdown.Item href="./profile">Edit Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavB;
