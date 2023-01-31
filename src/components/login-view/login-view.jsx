import React, { useState } from "react";
import PropTypes from "prop-types";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

import { MOVIE_API_URL } from "../../config";
import { connect } from "react-redux";
import { setMovies, setUser, setFaves } from "../actions/actions";
import { movieApp } from "../reducers/reducers";

export function LoginView(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Declare hook for each input
  const [usernameErr, setUsernameErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  // validate user inputs
  const validate = () => {
    let isReq = true;
    if (!username) {
      setUsernameErr("Username Required");
      isReq = false;
    } else if (username.length < 2) {
      setUsernameErr("Username must be 2 characters long");
      isReq = false;
    }
    if (!password) {
      setPasswordErr("Password Required");
      isReq = false;
    } else if (password.length < 6) {
      setPasswordErr("Password must be 6 characters long");
      isReq = false;
    }

    return isReq;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const isReq = validate();
    if (isReq) {
      /* Send request to the server for authentication */
      axios
        .post(`${MOVIE_API_URL}/login`, {
          Username: username,
          Password: password,
        })
        .then((response) => {
          const data = response.data;
          let token;
          if (!data.token) {
            token = data.user.token;
          } else {
            token = data.token;
          }
          props.onLoggedIn({ user: data.user, token });
        })
        .catch((e) => {
          console.log("Login Error", e);
        });
    }
  };

  return (
    <Form>
      <Form.Group controlId="formUsername">
        <Form.Label>Username:</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {/* code added here to display validation error */}
        {usernameErr && <p>{usernameErr}</p>}
      </Form.Group>

      <Form.Group controlId="formPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* code added here to display validation error */}
        {passwordErr && <p>{passwordErr}</p>}
      </Form.Group>
      <Button variant="primary" type="submit" onClick={handleLogin}>
        Submit
      </Button>
    </Form>
  );
}
let mapStateToProps = (state) => {
  return { movies: state.movies, user: state.user, favorites: state.favorites };
};

export default connect(mapStateToProps, { setMovies, setUser, setFaves })(
  LoginView
);
