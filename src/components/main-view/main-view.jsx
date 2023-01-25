import React from "react";
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

import { LoginView } from "../login-view/login-view";
import { MovieView } from "../movie-view/movie-view";
import { MovieCard } from "../movie-card/movie-card";
import { RegistrationView } from "../registration-view/registration-view";
import { ProfileView } from "../profile-view/profile-view";
import { Menubar } from "../navbar/navbar";
import { DirectorView } from "../director-view/director-view";
import { GenreView } from "../genre-view/genre-view";

import "./main-view.scss";
import { ProfileView } from "../profile-view/profile-view";
import { DirectorView } from "../director-view/director-view";

import { MOVIE_API_URL } from "../../config";

export class MainView extends React.Component {
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
  componentDidMount() {
    let accessToken = localStorage.getItem("token");
    let user = localStorage.getItem("user");
    console.log("AccessToken:", accessToken);
    console.log("User:", user);
    if (accessToken !== null && user !== null) {
      this.setState({
        user: user,
      });
      if (this.state.user) {
        this.getMovies(accessToken);
      }
    }
  }

  setSelectedMovie(newSelectedMovie) {
    this.setState({
      selectedMovie: newSelectedMovie,
    });
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
    if (!token) {
      console.log("Error: No token found.");
      return;
    }
    axios
      .get(`${MOVIE_API_URL}/movies`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Assign the result to the state
        this.setState({
          movies: response.data,
        });
      })
      .catch((error) => {
        console.log(`Error: ${error.message}`);
        console.log(`Request: ${JSON.stringify(error.config, null, 2)}`);
        console.log(`Response: ${JSON.stringify(error.response, null, 2)}`);
      });
  }

  // Fetch user data
  getUser(token) {
    const userId = localStorage.getItem("user");
    axios
      .get(`${MOVIE_API_URL}/users/${userId}`, {
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
    this.setState({ user: tempObject });
  };

  removeFromFavorites = (id) => {
    let tempObject = { ...this.state.user };
    //let indexToDelete = tempObject.FavoriteMovies.indexOf(id);
    //tempObject.FavoriteMovies.splice(indexToDelete, 1);
    tempObject.FavoriteMovies = tempObject.FavoriteMovies.filter(
      (movie) => movie._id !== id
    );
    this.setState({ user: tempObject });
  };

  onLoggedOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    console.log("Token:", localStorage.getItem("token"));
    console.log("User:", localStorage.getItem("user"));
    this.setState({
      user: null,
    });
  }

  onRegistration(registered) {
    this.setState({
      registered,
    });
  }
  rootPath(user) {
    if (!user) return <LoginView />;
  }

  render() {
    const { movies, movie, user, selectedMovie } = this.state;
    console.log("Movies from mainview: ", movies);
    console.log("User from mainview: ", user);

    return (
      <Router>
        <Menubar user={user} movies={movies} />
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
                      <ProfileView movies={movies} user={user} />
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
                      <ProfileView movies={movies} user={user} />
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
