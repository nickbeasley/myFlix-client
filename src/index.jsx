import React from "react";
import ReactDOM from "react-dom";
import MainView from "./components/main-view/main-view";
import Container from "react-bootstrap/Container";
import { Provider } from "react-redux";
import store from "./store";
import "./index.scss";

class MyFlixApplication extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Container style={{ minHeight: "100vh" }}>
          <MainView />
        </Container>
      </Provider>
    );
  }
}

// Finds the root of the app
const container = document.getElementsByClassName("app-container")[0];

// Tells React to render the app in the root DOM element
ReactDOM.render(React.createElement(MyFlixApplication), container);
