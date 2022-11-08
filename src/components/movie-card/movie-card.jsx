import React from "react";
import PropTypes from "prop-types";
import { Button, Card } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
  Link,
} from "react-router-dom";
import "./movie-card.scss";

export class MovieCard extends React.Component {
  render() {
    const { movie, onMovieClick, user } = this.props;
    return (
      <Card bg="light" border="light">
        <Card.Img variant="top" crossOrigin="anonymous" src={movie.ImagePath} />
        <Card.Body>
          <Card.Title>{movie.Title}</Card.Title>
          <Card.Text className="fs-6">{movie.ReleaseYear}</Card.Text>
          <Card.Text className="fs-5">
            {movie.Description.substring(0, 35)} ...{" "}
          </Card.Text>
          <Link to={`/movies/${movie._id}`}>
            <Button type="button" className="btn btn-secondary">
              Open
            </Button>
          </Link>
        </Card.Body>
      </Card>
    );
  }
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    Director: PropTypes.shape({
      Bio: PropTypes.string.isRequired,
      Birth: PropTypes.string.isRequired,
      Name: PropTypes.string.isRequired,
    }),
    Genre: PropTypes.shape({
      Description: PropTypes.string,
      Name: PropTypes.string.isRequired,
    }),
    ImagePath: PropTypes.string.isRequired,
  }).isRequired,
  onMovieClick: PropTypes.func,
  ReleaseYear: PropTypes.string,
};
