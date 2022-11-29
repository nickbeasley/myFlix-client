import { React, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Col, Row } from "react-bootstrap";
import axios from "axios";
import { useParams, Link, useNavigate, toArray } from "react-router-dom";
import "./movie-view.scss";
import { MovieCard } from "../movie-card/movie-card";

export function MovieView(props) {
  const user = localStorage.getItem("user");
  const userInfo = JSON.parse(user);
  const username = userInfo.Username;

  const { movieId } = useParams();
  let navigate = useNavigate();

  let [movie, setMovie] = useState({});
  console.log("Movies from movie-view: ", movie);
  console.log("movieId from movie-view: ", movieId);

  console.log("username from movie-view: ", username);
  console.log("userInfo from movie-view: ", userInfo);

  console.log("user from movie-view: ", user);

  //Works!
  function addFavorite(movieId) {
    const token = localStorage.getItem("token");
    axios
      .post(
        `https://nixflix.herokuapp.com/users/${username}/movies/${movieId}`,
        { username: localStorage.getItem("user") },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        console.log(response);
        props.addToFavorites(movieId);
        alert("Movie added");
      })
      .catch((error) => console.error(error));
  }

  // does work
  function removeFavorite(movieId) {
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
        props.removeFromFavorites(movieId);
        alert("Movie removed");
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    let film = props.movies.find(function (m) {
      return m._id == movieId;
    });
    setMovie(film);
  }, []);

  return (
    <div className="movie-view">
      <Row>
        <Col>
          <div className="movie-poster">
            <img className="img-fluid" src={movie.ImagePath} />
          </div>
        </Col>
      </Row>

      <Row>
        <Col className="fs-2">
          <div className="movie-title">
            <span className="value">{movie.Title}</span>
          </div>
        </Col>
      </Row>

      <Row>
        <Col className="fs-6">
          <div className="movie-release-year">
            <span className="value">{movie.ReleaseYear}</span>
          </div>
        </Col>
      </Row>

      <Row>
        <Col className="fs-4">
          <div className="movie-description">
            <span className="value">{movie.Description}</span>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="movie-genre">
            <span className="label">Genre: </span>
            <Button
              type="button"
              variant="link"
              onClick={() =>
                navigate(`/genres/${movie.Genre.Name}`, {
                  state: { Genre: movie },
                })
              }
            >
              {movie.Genre?.Name}
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="movie-director">
            <span className="label">Director: </span>
            <Button
              type="button"
              variant="link"
              onClick={() =>
                navigate(`/directors/${movie.Director.Name}`, {
                  state: { director: movie },
                })
              }
            >
              {movie.Director?.Name}
            </Button>
          </div>
        </Col>
      </Row>

      <Col className="movie-view-favorite-button">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => addFavorite(movieId)}
        >
          Add to favorites
        </button>
      </Col>
      <Col>
        <Button
          className="movie-view-remove-favorite-button"
          variant="btn btn-secondary"
          size="sm"
          type="button"
          onClick={() => removeFavorite(movieId)}
        >
          Remove from favorites
        </Button>
      </Col>
      {/* <Row>
        <Col>
          <div className="movie-featured">
            <span className="label">Featured: </span>
            <span className="value">{movie.featured ? "true" : "false"}</span>
          </div>
        </Col>
      </Row> */}

      <Col className="movie-view-back-button">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/", { replace: true })}
        >
          Back to Movies
        </button>
      </Col>
    </div>
  );
}

MovieView.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string,
    Description: PropTypes.string,
    ImagePath: PropTypes.string,
    Genre: PropTypes.shape({
      Name: PropTypes.string,
      Description: PropTypes.string,
    }),
    Actors: PropTypes.array,
    Director: PropTypes.shape({
      Name: PropTypes.string,
      Bio: PropTypes.string,
      Birth: PropTypes.string,
      Death: PropTypes.string,
    }),
  }),
  onBackClick: PropTypes.func,
};
