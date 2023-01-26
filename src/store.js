import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./components/reducers/reducers";
import logger from "redux-logger";
import auth from "./components/reducers/reducers";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(logger))
);

export default store;
