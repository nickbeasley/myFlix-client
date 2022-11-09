import React, { useState, useEffect } from "react";

import { useParams, Link, useNavigate, useLocation } from "react-router-dom";

import { Container, Col, Row, Button, Card, ListGroup } from "react-bootstrap";

import { MovieCard } from "../movie-card/movie-card";

import PropTypes from "prop-types";

export function GenreView(props) {
  const { name } = useParams();
  let navigate = useNavigate();

  console.log("genre name:", name);

  if (name === "all") {
    return (
      <ListGroup as="ul">
        {props.movies.map((movie) => (
          <ListGroup.Item as="li" variant="secondary" key={movie._id}>
            <Link to={`/genres/${movie.Genre.Name}`}>{movie.Genre.Name}</Link>
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  }
  let genre = props.movies.find((movie) => movie.Genre.Name === name);
  console.log("genre: ", genre);
  return (
    <Container className="genre-view">
      <Card>
        <Row>
          <Col className="value">
            <Card.Header>
              <h1>{genre.Genre.Name}</h1>
            </Card.Header>
            <p className="value"> {genre.Genre.Description}</p>
          </Col>
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
