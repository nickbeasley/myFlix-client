import { React, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, ButtonGroup, Col, Row, Button } from "react-bootstrap";
import axios from "axios";
import { useParams, Link, useNavigate, toArray } from "react-router-dom";
import "./movie-view.scss";
import { MovieCard } from "../movie-card/movie-card";
import { MOVIE_API_URL } from "../../config";
import { connect, useDispatch } from "react-redux";
import { setMovies, setUser, setFaves, setFilter } from "../actions/actions";

export function MovieView(props) {
  const user = localStorage.getItem("user");
  const userInfo = JSON.parse(user);
  const username = userInfo.Username;

  const dispatch = useDispatch();
  const { movieId } = useParams();
  let navigate = useNavigate();

  let [movie, setMovie] = useState({});
  console.log("Movies from movie-view: ", movie);
  console.log("movieId from movie-view: ", movieId);
  console.log("username from movie-view: ", username);
  console.log("userInfo from movie-view: ", userInfo);
  console.log("user from movie-view: ", user);

  // refreshes user after adding or removing a movie from favorites so it'll be refliected in the profile view
  function refreshUser() {
    const token = localStorage.getItem("token");
    axios
      .get(`${MOVIE_API_URL}/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response);
        localStorage.setItem("user", JSON.stringify(response.data));
        dispatch(setUser(response.data));
      })
      .catch((error) => console.error(error));
  }
  // Add movie to favorites - works
  function addFavorite(movieId) {
    const token = localStorage.getItem("token");
    axios
      .post(
        `${MOVIE_API_URL}/users/${username}/movies/${movieId}`,
        { username: localStorage.getItem("user") },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        console.log(response);
        alert("Movie added");
        dispatch(setFaves(response.data.FavoriteMovies));
        refreshUser();
      })
      .catch((error) => console.error(error));
  }
  // Remove movie from favorites - works
  function removeFavorite(movieId) {
    const token = localStorage.getItem("token");
    axios
      .delete(`${MOVIE_API_URL}/users/${username}/movies/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response);
        alert("Movie removed");
        dispatch(setFaves(response.data.FavoriteMovies));
        refreshUser();
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
      <ButtonGroup size="sm" vertical>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => addFavorite(movieId)}
        >
          Add favorite
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => removeFavorite(movieId)}
        >
          Remove Favorite
        </Button>
        <Button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/", { replace: true })}
        >
          Movie List
        </Button>
        <Button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/users/", { replace: true })}
        >
          Profile
        </Button>
      </ButtonGroup>
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

function mapStateToProps(state) {
  return {
    movies: state.movies,
    user: state.user,
    favorites: state.favorites,
  };
}

export default connect(mapStateToProps, {
  setMovies,
  setUser,
  setFaves,
  setFilter,
})(MovieView);
