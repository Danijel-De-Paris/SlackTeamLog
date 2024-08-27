import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import slackTeamReducer from "./reducers/slackTeamReducer";

const rootReducer = combineReducers({
    slackTeam: slackTeamReducer,
});

const store = createStore(
    rootReducer,
    applyMiddleware(thunkMiddleware)
);

export default store;