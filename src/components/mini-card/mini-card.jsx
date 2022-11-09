import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Card,
  CardGroup,
  Col,
  ListGroup,
  ListGroupItem,
  Row,
} from "react-bootstrap";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
  Link,
} from "react-router-dom";
import "./mini-card.scss";

export class MiniCard extends React.Component {
  render() {
    const { movie, onMovieClick, user } = this.props;
    return (
      <ListGroup as="ul" className="bg-light bg-border-light">
        <ListGroupItem as="li" variant="secondary">
          <Link to={`/movies/${movie._id}`}>{movie.Title}</Link>
        </ListGroupItem>
      </ListGroup>
    );
  }
}
