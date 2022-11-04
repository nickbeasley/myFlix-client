import React, { useState, useEffect } from "react";

import { useParams, Link, useNavigate, useLocation } from "react-router-dom";

import { Container, Col, Row, Button, Card } from "react-bootstrap";

import { MovieCard } from "../movie-card/movie-card";

import PropTypes from "prop-types";

export function GenreView(props) {
  const { name } = useParams();
  let navigate = useNavigate();
  // Here I'm telling state to useLocation which allows it to see the value being passed from MovieView
  // and then telling director to equal the state (movie array) from MovieView
  const { state } = useLocation();
  const { genre } = state;

  let [setDirector, movie, movies, directorList] = useState({});

  return (
    <Container className="genre-view">
      <Card>
        <Row>
          <Col className="value">
            <Card.Header>
              <h1>{genre.Genre.Name}</h1>
            </Card.Header>
            <p className="value">Description: {genre.Genre.Description}</p>
          </Col>
        </Row>

        <Card.Footer>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/", { replace: true })}
          >
            go back
          </button>
        </Card.Footer>
      </Card>
    </Container>
  );
}
