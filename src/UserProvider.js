import React, {createContext, useEffect, useReducer} from "react";
import { auth} from "./firebase";
import Reducer, {ACTIONS} from '../src/reducer';

const initialState = {
  user: undefined,
  error: undefined,
  disableTimer: false,
  submission: {
    qid: undefined,
    option: undefined,
    submitted: false,
    percent: 100
  },
  resetTimer: true
};

const UserProvider = ({children}) => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  useEffect(() => {
    async function updateUserState() {
      auth.onAuthStateChanged( async userAuth => {
        dispatch({ payload: {user: userAuth}, type:ACTIONS.UPDATE_AUTH });
        console.log("The user auth state changed", userAuth);
        // This will give a rough user state
        // That can be used by someone
        // const user = await generateUserDocument(userAuth);
      });
    }
    updateUserState();
  },[]);

    return (
      <UserContext.Provider value={[state, dispatch]}>
        {children}
      </UserContext.Provider>
    );
}
export const UserContext = createContext(initialState);
export const UserConsumer = UserContext.Consumer;
export default UserProvider;