import { combineReducers } from "redux";
import { connectRouter } from 'connected-react-router';
import { history } from '../history';
import auth from "./auth";
import common from "./common";
import gallery from "./gallery";
import menu from "./menu";
import store from "./store";
import inventory from "./inventory";

export default combineReducers({
    inventory,
    auth,
    common,
    gallery,
    menu,
    store,
    router: connectRouter(history)
});