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

export function DirectorView(props) {
  const { name } = useParams();
  let navigate = useNavigate();
  const removeDuplicates = function (array) {
    let uniqueDirectors = new Set();
    let uniqueMovies = [];
    array.forEach((movie) => {
      if (!uniqueDirectors.has(movie.Director.Name)) {
        uniqueDirectors.add(movie.Director.Name);
        uniqueMovies.push(movie);
      }
    });
    return uniqueMovies;
  };
  const moviesWithoutDuplicates = removeDuplicates(props.movies);
  console.log("movies without duplicates:", moviesWithoutDuplicates);
  console.log("director name:", name);

  if (name === "all") {
    return (
      <ListGroup as="ul">
        {moviesWithoutDuplicates.map((movie) => (
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
              onClick={() => navigate("/directors/all", { replace: true })}
            >
              Director List
            </button>
          </ButtonGroup>
        </Card.Footer>
      </Card>
    </Container>
  );
}
