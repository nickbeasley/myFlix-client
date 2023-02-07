import React from "react";
import { connect, useDispatch } from "react-redux";
import axios from "axios";
import propTypes from "prop-types";
import { Row, Col, Container } from "react-bootstrap";
import {
  BrowserRouter as Router,
  useParams,
  Route,
  Navigate,
  useNavigate,
  Routes,
  Link,
} from "react-router-dom";
import { setMovies, setUser, setFaves, setFilter } from "../actions/actions";
import { LoginView } from "../login-view/login-view";
import { MovieView } from "../movie-view/movie-view";
import { MovieCard } from "../movie-card/movie-card";
import { RegistrationView } from "../registration-view/registration-view";
import ProfileView from "../profile-view/profile-view";
import Menubar from "../navbar/navbar";
import { DirectorView } from "../director-view/director-view";
import { GenreView } from "../genre-view/genre-view";
import "./main-view.scss";
import { MOVIE_API_URL } from "../../config";
import Utils from "../../utils";

class MainView extends React.Component {
  constructor() {
    super();
    this.state = {
      movies: [],
      selectedMovie: null,
      user: null,
      registered: true,
      FavoriteMovies: [],
    };
  }
  componentDidMount = async () => {
    let accessToken = localStorage.getItem("token");
    let user = localStorage.getItem("user");
    console.log("AccessToken:", accessToken);
    console.log("User:", user);
    if (accessToken !== null && user !== null) {
      await this.setState({
        user: user,
      });
      this.props.setUser(JSON.parse(user));
      if (this.state.user) {
        this.getMovies(accessToken);
      }
    }
  };
  setSelectedMovie(newSelectedMovie) {
    this.props.setSelectedMovie(newSelectedMovie);
  }

  onLoggedIn(authData) {
    console.log(authData);
    const { user, token } = authData;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    this.setState({
      user: authData.user,
    });
    this.getMovies(token);
  }

  getMovies(token) {
    axios
      .get(`${MOVIE_API_URL}/movies`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        this.props.setMovies(response.data);
        console.log(this.props);
        this.setState({
          movies: response.data,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getUser(user, token) {
    const username = localStorage.getItem("user");
    axios
      .get(`${MOVIE_API_URL}/users/${user}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        this.props.setUser(response.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  addToFavorites = (id) => {
    let tempObject = { ...this.state.user };
    tempObject.FavoriteMovies = Utils.removeDuplicates(
      tempObject.FavoriteMovies
    );
    if (!tempObject.FavoriteMovies.includes(id)) {
      tempObject.FavoriteMovies.push(id);
    }
    this.props.dispatch(setUser(tempObject));
  };

  removeFromFavorites = (id) => {
    let tempObject = { ...this.state.user };
    tempObject.FavoriteMovies = tempObject.FavoriteMovies.filter(
      (movie) => movie._id !== id
    );
    this.props.dispatch(setUser(tempObject));
  };
  getFaves(user, token) {
    axios
      .get(`${MOVIE_API_URL}/users/${user}/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        this.props.setFaves(response.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  onLoggedOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.setState({
      user: null,
    });
  }

  onRegistration = (registered) => {
    this.setState({ registered });
  };

  rootPath(user) {
    if (!user) return <LoginView />;
  }

  render() {
    const { movies, movie, user, selectedMovie } = this.state;
    console.log("User:", user);
    return (
      <Router>
        <Menubar />
        <Container>
          <Row className="main-view d-flex justify-content-center pb-5 px-3 pt-3">
            <Routes>
              <Route
                path="/"
                element={
                  !user ? (
                    <Container>
                      <Row>
                        <Col className="m-4">
                          <LoginView
                            onLoggedIn={(user) => this.onLoggedIn(user)}
                          />
                        </Col>
                      </Row>
                    </Container>
                  ) : !movies.length ? (
                    <div>No movies</div>
                  ) : (
                    movies.map((m) => (
                      <Col key={m._id} className="movie-card">
                        <MovieCard movie={m} />
                      </Col>
                    ))
                  )
                }
              />

              <Route
                path="/register"
                element={
                  user ? (
                    <Navigate to="/" replace />
                  ) : (
                    <Col lg={8} md={8}>
                      <RegistrationView />
                    </Col>
                  )
                }
              />

              <Route
                path={`/users/`}
                element={
                  !user ? (
                    <Navigate to="/" replace />
                  ) : (
                    <Col lg={8} md={8}>
                      <ProfileView
                        movies={movies}
                        user={user}
                        Username={user.Username}
                      />
                    </Col>
                  )
                }
              />

              <Route
                path={`/users/:name`}
                element={
                  !user ? (
                    <Navigate to="/" replace />
                  ) : (
                    <Col lg={8} md={8}>
                      <ProfileView />
                    </Col>
                  )
                }
              />

              <Route path="/movies">
                <Route
                  path=":movieId"
                  element={
                    <Col md={6}>
                      <MovieView movies={movies} />
                    </Col>
                  }
                />
              </Route>

              <Route path="/directors">
                <Route
                  path=":name"
                  element={
                    !user ? (
                      <Navigate to="/" replace />
                    ) : (
                      <Col>
                        <DirectorView movies={movies} />
                      </Col>
                    )
                  }
                />
              </Route>

              <Route path="/genres">
                <Route
                  path=":name"
                  element={
                    !user ? (
                      <Navigate to="/" replace />
                    ) : (
                      <Col>
                        <GenreView movies={movies} />
                      </Col>
                    )
                  }
                />
              </Route>
            </Routes>
          </Row>
        </Container>
      </Router>
    );
  }
}
mapStateToProps = (state) => {
  return {
    movies: state.movies,
    user: state.user,
    favorites: state.favorites,
  };
};

export default connect(mapStateToProps, {
  setMovies,
  setUser,
  setFaves,
  setFilter,
})(MainView);
