import { combineReducers } from "redux";
import quiz from "./quiz";
import user from './user';

export default combineReducers({ quiz, user });
