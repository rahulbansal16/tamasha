import React, {createContext, useEffect, useReducer} from "react";
import { auth} from "./firebase";
import Reducer from '../src/reducer';

const initialState = {
  user: null,
  error: null,
  disableTimer: false  
};

const UserProvider = ({children}) => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  useEffect(() => {
    async function updateUserState() {
      auth.onAuthStateChanged( async userAuth => {
        this.setState({ user: userAuth});
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