import React from "react";
import axios from "axios";
import propTypes from "prop-types";
import { Row, Col, Container } from "react-bootstrap";
import Utils from "../../utils.js";

import {
  BrowserRouter as Router,
  useParams,
  Route,
  Navigate,
  useNavigate,
  Routes,
  Link,
} from "react-router-dom";

//import { render } from "react-dom/cjs/react-dom.production.min";

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

import { connect } from "react-redux";

import { setMovies } from "../../actions/actions";

import MoviesList from "../movies-list/movies-list";

export class MainView extends React.Component {
  constructor() {
    super();
    // this.state = {
    //   movies: [],
    //   selectedMovie: null,
    //   user: null,
    //   registered: true,
    //   FavoriteMovies: [],
    // };
  }
  componentDidMount() {
    let accessToken = localStorage.getItem("token");
    if (accessToken !== null) {
      let user = localStorage.getItem("user");
      this.setState({
        user: JSON.parse(user),
      });
      this.getMovies(accessToken);
    }
  }
  setSelectedMovie(newSelectedMovie) {
    this.setState({
      selectedMovie: newSelectedMovie,
    });
  }

  onLoggedIn(authData) {
    this.props.setUser(authData.user);
    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", authData.user.Username);
    this.getMovies(authData.token);
  }

  getMovies(token) {
    axios
      .get(`https://nixflix.herokuapp.com/movies`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        this.props.setMovies(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Fetch user data
  getUser(token) {
    const user = localStorage.getItem("user");
    axios
      .get(`https://nixflix.herokuapp.com/users/${user}`, {
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
    let movies = this.props;
    let user = this.state;
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
                        return <MoviesList movies={movies} />;
                        {/* <MovieCard movie={m} /> */}
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

              {/* <Route
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
              /> */}

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
                      <MovieView
                        addToFavorites={this.addToFavorites}
                        removeFromFavorites={this.removeFromFavorites}
                        movies={movies}
                      />
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
let mapStateToProps = (state) => {
  return { movies: state.movies };
};

export default connect(mapStateToProps, { setMovies })(MainView);
