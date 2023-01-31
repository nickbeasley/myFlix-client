import { React, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Container, Form, Button, Card, Col, Row, Link } from "react-bootstrap";

import { Link, useNavigate } from "react-router-dom";

import "./profile-view.scss";

import { MiniCard } from "../mini-card/mini-card";

import { MovieCard } from "../movie-card/movie-card";

import { MOVIE_API_URL } from "../../config";

import { connect, useDispatch } from "react-redux";

function ProfileView(props) {
  let navigate = useNavigate();

  const dispatch = useDispatch();
  const setFaves = (faves) => {
    dispatch({
      type: setFaves,
      value: faves,
    });
  };

  // Declare hook for each input
  const { user, movies } = props;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [usernameErr, setUsernameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [birthdayErr, setBirthdayErr] = useState("");

  console.log("movies: ", movies);

  console.log("User from profile-view: ", user);

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
        .delete(`${MOVIE_API_URL}/users/${user.Username}`, {
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
  console.log(typeof user, user);
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
        <Card.Header className="text-center bg-dark text-light" as="h5">
          Favorites:
        </Card.Header>
        <Card>
          <Card.Body>
            {props.movies
              .filter((movie) => user.FavoriteMovies.includes(movie._id))
              .map((movie) => (
                <MiniCard movie={movie} />
              ))}
          </Card.Body>
        </Card>

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
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {usernameErr && <p>{usernameErr}</p>}
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
        </Card.Body>

        <Card.Body style={{ backgroundColor: "lightgray" }}>
          <Card>
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
            onClick={() => navigate("/", { replace: true })}
          >
            All Movies
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );
}
mapStateToProps = (state) => {
  return {
    movies: state.movies,
    user: state.user,
    favorites: state.favorites,
  };
};

export default connect(mapStateToProps)(ProfileView);
