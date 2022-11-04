import React, { useState } from "react";
import PropTypes from "prop-types";

import axios from "axios";

import {
  Form,
  Button,
  Card,
  CardGroup,
  Container,
  Col,
  Row,
} from "react-bootstrap";

export function RegistrationView(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

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

  const handleRegister = (e) => {
    e.preventDefault();
    const isReq = validate();
    if (isReq) {
      axios
        .post("https://nixflix.herokuapp.com/users", {
          Username: username,
          Password: password,
          Email: email,
          Birthday: birthday,
        })
        .then((response) => {
          const data = response.data;
          console.log(data);
          alert("Registration successful, please login");
          window.open("/", "_self"); // the second argument '_self' is necessary so that the page will open in the current tab
        })
        .catch((response) => {
          console.error(response);
          alert("Unable to register");
        });
    }
  };

  return (
    <Row>
      <Col>
        <Card>
          <Card.Body>
            <Card.Title>Registration</Card.Title>
            <Form>
              <Form.Group>
                <Form.Label>Username: </Form.Label>
                <Form.Control
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="enter a username"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Password: </Form.Label>
                <Form.Control
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="enter a password"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Email: </Form.Label>
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="enter an email"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label> Birthday: </Form.Label>
                <Form.Control
                  type="birthday"
                  onChange={(e) => setBirthday(e.target.value)}
                  placeholder="enter your birthday"
                />
              </Form.Group>

              <Button variant="primary" type="submit" onClick={handleRegister}>
                Submit
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  RegistrationView.propTypes = {
    register: PropTypes.shape({
      name: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      password: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      // Birthday: PropTypes.string.isRequired,
    }),
  };
}
