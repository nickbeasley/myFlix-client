import React, { useState, useEffect } from "react";

import { useParams, Link, useNavigate, useLocation } from "react-router-dom";

import {
  Button,
  Container,
  Col,
  Row,
  Button,
  Card,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";

import { MovieCard } from "../movie-card/movie-card";

import PropTypes from "prop-types";
import { MainView } from "../main-view/main-view";

export function DirectorView(props) {
  const { name } = useParams();
  let navigate = useNavigate();

  console.log("direector name:", name);

  if (name === "all") {
    return (
      <ListGroup as="ul">
        {props.movies.map((movie) => (
          <ListGroup.Item as="li" variant="secondary" key={movie._id}>
            <Link to={`/directors/${movie.Director.Name}`}>
              {movie.Director.Name}
            </Link>
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  }
  let director = props.movies.find((movie) => movie.Director.Name === name);
  console.log("director: ", director);
  return (
    <Container className="director-view">
      <Card>
        <Row>
          <Col className="value">
            <Card.Header>
              <h1>{director.Director.Name}</h1>
            </Card.Header>
            <p className="value">
              {" "}
              {director.Director.Birth} - {director.Director.Death}
            </p>
          </Col>
        </Row>

        <Row>
          <Col className="value">{director.Director.Bio}</Col>
        </Row>
        <Card.Footer>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/", { replace: true })}
          >
            Return to movies
          </button>
        </Card.Footer>
      </Card>
    </Container>
  );
}
