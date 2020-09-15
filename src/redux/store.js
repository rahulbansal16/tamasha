import { createStore } from "redux";
import rootReducer from "./reducers";
import { composeWithDevTools } from 'redux-devtools-extension';

const initialState = {
    liveQuestion: null,
    user: null,
    answer: null,
    event:null
}
export default createStore(rootReducer, initialState, composeWithDevTools());
