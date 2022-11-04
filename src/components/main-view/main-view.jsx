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
    console.log("authData from onLoggedIn function", authData);
    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", JSON.stringify(authData.user));
    this.setState({
      user: authData.user,
    });
    this.getMovies(authData.token);
  }

  getMovies(token) {
    axios
      .get("https://nixflix.herokuapp.com/movies", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Assign the result to the state
        this.setState({
          movies: response.data,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

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
              {/* This route now looks pretty simple, its being used with the navigation 
              link in MovieView and also receiving its information from MovieView */}
              <Route
                path="/directors"
                element={
                  <Col>
                    <DirectorView />
                  </Col>
                }
              />
              <Route path="/directors">
                <Route
                  path=":name"
                  element={
                    !user ? (
                      <Navigate to="/" replace />
                    ) : (
                      <Col>
                        <DirectorView />
                      </Col>
                    )
                  }
                />
              </Route>
              <Route path="/genres">
                <Route
                  path={`/genres:name`}
                  element={({ match, history }) => {
                    !user ? (
                      <Navigate to="/" replace />
                    ) : (
                      <Col>
                        <GenreView
                          genre={
                            movies.find(
                              (m) => m.Genre.Name == match.params.name
                            ).Genre
                          }
                        />
                      </Col>
                    );
                  }}
                />
              </Route>
            </Routes>
          </Row>
        </Container>
      </Router>
    );
  }
}
