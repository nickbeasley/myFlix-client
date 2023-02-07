import { useState } from "react";
import { Navbar, Nav, Button, Container, NavbarBrand } from "react-bootstrap";
import NavbarCollapse from "react-bootstrap/esm/NavbarCollapse";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
function Menubar({ user }) {
  const onLoggedOut = () => {
    localStorage.clear();
    window.open("/", "_self");
  };

  let navigate = useNavigate();

  const isAuth = () => {
    if (typeof window == "undefined") {
      return false;
    }
    if (localStorage.getItem("token")) {
      return localStorage.getItem("token");
    } else {
      return false;
    }
  };
  const [expanded, setExpanded] = useState(false);
  return (
    <Navbar
      expanded={expanded}
      className="main-nav navbar-collapse"
      sticky="top"
      bg="dark"
      expand="lg"
      variant="dark"
    >
      <Container>
        <Navbar.Brand>
          <img
            src="/images/nkblogoblue.svg"
            height={50}
            width={50}
            alt="Logo"
          ></img>
        </Navbar.Brand>
        <Navbar.Brand className="navbar-logo" to="/" as={Link}>
          NixFlix
        </Navbar.Brand>
        <Navbar.Toggle
          onClick={() => setExpanded(expanded ? false : "expanded")}
          aria-controls="responsive-navbar-nav"
        />
        <Navbar.Collapse id="resposive-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link onClick={() => setExpanded(false)} to="/" as={Link}>
              Home
            </Nav.Link>

            {user && (
              <>
                <Nav.Link
                  onClick={() => setExpanded(false)}
                  to={`/users/${user.Username}`}
                  as={Link}
                >
                  Profile
                </Nav.Link>

                <Nav.Link
                  onClick={() => setExpanded(false)}
                  to={`/directors/all`}
                  as={Link}
                >
                  Directors
                </Nav.Link>

                <Nav.Link
                  onClick={() => setExpanded(false)}
                  to={`/genres/all`}
                  as={Link}
                >
                  Genres
                </Nav.Link>

                <Nav.Link onClick={onLoggedOut} as={Link}>
                  Logout
                </Nav.Link>
              </>
            )}
            {!user && (
              <>
                <Nav.Link onClick={() => setExpanded(false)} to="/" as={Link}>
                  Sign-in
                </Nav.Link>
                <Nav.Link
                  onClick={() => setExpanded(false)}
                  to="/register"
                  as={Link}
                >
                  Sign-up
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
function mapStateToProps(state) {
  return {
    movies: state.movies,
    user: state.user,
    favorites: state.favorites,
  };
}

export default connect(mapStateToProps)(Menubar);
