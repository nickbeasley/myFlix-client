import { React, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Col, Row } from "react-bootstrap";

import { useParams, Link, useNavigate } from "react-router-dom";

import "./movie-view.scss";
import { MovieCard } from "../movie-card/movie-card";

export function MovieView(props) {
  const { movieId } = useParams();
  let navigate = useNavigate();

  let [movie, setMovie] = useState({});
  console.log("Movies from movie-view: ", movie);

  useEffect(() => {
    let film = props.movies.find(function (m) {
      return m._id == movieId;
    });
    setMovie(film);
  }, []);

  function addFavorite(movieId) {
    const { movie } = props;
    const username = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    const addFavorite = (e) => {
      e.preventDefault();
      axios
        .post(
          `https://nixflix.herokuapp.com/users/${username}/movies/${movie._id}`,
          { username: localStorage.getItem("user") },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          console.log(response);
          alert("Movie added");
        })
        .catch((error) => console.error(error));
    };
  }
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
        <Col>
          <div className="movie-title">
            <span className="value">{movie.Title}</span>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="movie-description">
            <span className="value">{movie.Description}</span>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="movie-genre">
            <span className="label">Genre:</span>
            <Link to={`/genres/${movie.Genre?.Name}`}>
              <Button type="button" variant="link">
                {movie.Genre?.Name}
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
      {/* 
link to DirectorView by sending it to the correct end point. 
Line 95 is passing the value of "movie" (which is the current selected movie's  full array)
from MovieView as "director" into DirectorView */}
      <Row>
        <Col>
          <div className="movie-director">
            <span className="label">Director: </span>
            <Button
              type="button"
              variant="link"
              onClick={() =>
                navigate("/directors/:name", {
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
          Go back
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
