import { combineReducers } from "redux";
import { ClientReducer } from "./Client/reducer/reducer";

const rootReducer = combineReducers({
  client: ClientReducer,
});

export default rootReducer;
