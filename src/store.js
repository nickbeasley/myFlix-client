import { createStore, applyMiddleware, compose } from "redux";
import moviesApp from "./components/reducers/reducers";
import { devToolsEnhancer } from "redux-devtools-extension";

const store = createStore(moviesApp, devToolsEnhancer());
export default store;
