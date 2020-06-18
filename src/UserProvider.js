import React, { Component, createContext } from "react";
import { auth, generateUserDocument } from "./firebase";

export const UserContext = createContext({ user: null });
export const UserConsumer = UserContext.Consumer;

class UserProvider extends Component {
  state = {
    user: null
  };

  componentDidMount = async () => {
    auth.onAuthStateChanged( async userAuth => {
      this.setState({ user: userAuth});
      console.log("The user auth state changed", userAuth);
      // This will give a rough user state
      // That can be used by someone
      // const user = await generateUserDocument(userAuth);
    });
  };


  render() {
    return (
      <UserContext.Provider value={this.state.user}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}
export default UserProvider;