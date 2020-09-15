import { combineReducers } from "redux";
import quiz from "./quiz";
import user from './user';
import event from './event';

export default combineReducers({ quiz, user, event });
