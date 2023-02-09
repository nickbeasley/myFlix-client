import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Col,
  Row,
  Button,
  Card,
  ListGroup,
  ButtonGroup,
} from "react-bootstrap";
import { MovieCard } from "../movie-card/movie-card";
import PropTypes from "prop-types";

export function GenreView(props) {
  const { name } = useParams();
  let navigate = useNavigate();

  const removeDuplicates = function (array) {
    let uniqueGenres = new Set();
    let uniqueMovies = [];
    array.forEach((movie) => {
      if (!uniqueGenres.has(movie.Genre.Name)) {
        uniqueGenres.add(movie.Genre.Name);
        uniqueMovies.push(movie);
      }
    });
    return uniqueMovies;
  };
  const moviesWithoutDuplicates = removeDuplicates(props.movies);

  if (name === "all") {
    return (
      <ListGroup as="ul">
        {moviesWithoutDuplicates.map((movie) => (
          <ListGroup.Item as="li" variant="secondary" key={movie._id}>
            <Link to={`/genres/${movie.Genre.Name}`}>{movie.Genre.Name}</Link>
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  }

  let genre = props.movies.find((movie) => movie.Genre.Name === name);
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
          <ButtonGroup>
            <button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => navigate("/", { replace: true })}
            >
              Movie List
            </button>
            <button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => navigate("/genres/all", { replace: true })}
            >
              Genre List
            </button>
          </ButtonGroup>
        </Card.Footer>
      </Card>
    </Container>
  );
}
