import { React, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Container, Form, Button, Card, Col, Link } from "react-bootstrap";

import { Link } from "react-router-dom";

import "./profile-view.scss";
export function ProfileView(props) {
  // Declare hook for each input
  const { user, movies, onBackClick } = props;

  const [
    username,
    usernameErr,
    setUsernameErr,
    birthday,
    password,
    email,
    passwordErr,
    setPasswordErr,
    emailErr,
    setEmailErr,
    birthdayErr,
    favoriteMovies,
  ] = useState({});

  // Validate user inputs
  const validate = () => {
    let isReq = true;
    if (!username) {
      setUsernameErr(<span style={{ color: "red" }}>Username Required</span>);
      isReq = false;
    } else if (username.length < 2) {
      setUsernameErr(
        <span style={{ color: "red" }}>
          Username must have at least 2 characters
        </span>
      );
      isReq = false;
    }
    if (!password) {
      setPasswordErr(<span style={{ color: "red" }}>Password Required</span>);
      isReq = false;
    } else if (password.length < 6) {
      setPasswordErr(
        <span style={{ color: "red" }}>
          Password must have at least 6 characters
        </span>
      );
      isReq = false;
    }
    if (!email) {
      setEmailErr(<span style={{ color: "red" }}>Email Required</span>);
      isReq = false;
    } else if (email.indexOf("@") === -1) {
      setEmailErr(
        <span style={{ color: "red" }}>Please enter correct email address</span>
      );
      isReq = false;
    }
    return isReq;
  };

  //Works
  const handleDelete = (e) => {
    const confirmDelete = window.confirm("Confirm to remove");

    if (confirmDelete) {
      const username = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      axios
        .delete(`https://nixflix.herokuapp.com/users/${user.Username}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          alert("Profile successfully deleted");
          window.location.pathname = "/";
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  // const favoriteMovie = favoriteMovies.map((movieId) =>
  //   movies.find((movie) => movie._id === movieId)
  // );

  const removeFavorite = (m) => {
    // e.preventDefault();
    const username = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    axios
      .delete(
        `https://nixflix.herokuapp.com/users/${username}/movies/${movieId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        console.log(response);
        alert("Movie was removed");
        this.componentDidMount();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <Container className="profile-container">
      <Card bg="light" border="secondary" className="profile-card">
        <Card.Header className="text-center bg-dark text-light" as="h5">
          Profile
        </Card.Header>
        <Card.Body style={{ backgroundColor: "lightgray" }}>
          <Card bg="dark" text="light">
            Logged in as: {user.Username}
          </Card>
        </Card.Body>
        <Card.Body style={{ backgroundColor: "lightgray" }}>
          <Card bg="dark" text="light">
            Email: {user.Email}{" "}
          </Card>
        </Card.Body>
        <Card.Body style={{ backgroundColor: "lightgray" }}>
          <Card bg="dark" text="light">
            <span className="label text-center headline-profile-update">
              Update profile information
            </span>
            <Form bg="secondary" border="secondary">
              <Form.Group
                className="profile-form-group-username"
                controlId="formGroupUsername"
              >
                <Form.Label>Username:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your username"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                {usernameErr && <p>{usernameErr}</p>}
              </Form.Group>
              <Form.Group
                className="profile-form-group-password"
                controlId="formGroupPassword"
              >
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password must be 6 or more characters"
                  minLength="6"
                  required
                />
                {passwordErr && <p>{passwordErr}</p>}
              </Form.Group>
              <Form.Group
                className="profile-form-group-email"
                controlId="formGroupEmail"
              >
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
                {emailErr && <p>{emailErr}</p>}
              </Form.Group>
              <Form.Group
                className="profile-form-group-birthday"
                controlId="formGroupBirthday"
              >
                <Form.Label>Date of birth:</Form.Label>
                <Form.Control
                  type="date"
                  onChange={(e) => setBirthday(e.target.value)}
                  placeholder="Enter your birthday"
                />
                {birthdayErr && <p>{birthdayErr}</p>}
              </Form.Group>
            </Form>
          </Card>
          <Card
            className="submit-button-card"
            style={{ backgroundColor: "lightgray" }}
          >
            <Button
              className="button-profile-view-update"
              variant="secondary"
              type="submit"
              // onClick={handleUpdate}
            >
              Update
            </Button>
          </Card>

          <div className="favorite-div">
            <Card bg="dark" text="light">
              <span className="label headline-profile-mini-cards">
                My favorite movies
              </span>
            </Card>
          </div>

          <Card className="h-100" bg="dark" text="light">
            <Link to={`/movies/`} className="profile-movie-card-link">
              <Card.Img
                variant="top"
                crossOrigin="anonymous | use-credentials"
                alt="Card Img"
              />
              <Card.Body>
                <Card.Title>Card title</Card.Title>
              </Card.Body>
            </Link>
            <Button
              className="button-profile-view-remove-favorite"
              variant="outline-danger"
              size="sm"
              type="button"
              onClick={() => removeFavorite()}
            >
              Remove
            </Button>
          </Card>
        </Card.Body>
        <Card.Body style={{ backgroundColor: "lightgray" }}>
          <Card>
            <Card.Header className="bg-dark text-light">
              <span className="label text-center headline-profile-delete">
                Delete account
              </span>
            </Card.Header>
            <Col className="bg-dark">
              <Button
                className="button button-profile-view-delete"
                variant="danger"
                type="submit"
                onClick={handleDelete}
              >
                DELETE ACCOUNT
              </Button>
            </Col>
          </Card>
        </Card.Body>

        <Card.Footer className="text-right bg-dark text-light">
          <Button
            className="button-profile-view-back"
            variant="secondary"
            onClick={() => {
              onBackClick();
            }}
          >
            Back
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );
}

ProfileView.propTypes = {
  favoriteMovies: PropTypes.array,
};
