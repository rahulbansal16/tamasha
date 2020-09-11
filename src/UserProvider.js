import React from "react";
import {auth} from "./firebase";
import {connect} from "react-redux";
import {updateUserState} from './redux/actions';

// const initialState = {
//   user: undefined,
//   error: undefined,
//   disableTimer: false,
//   submission: {
//     qid: undefined,
//     option: undefined,
//     submitted: false,
//     percent: 100
//   },
//   resetTimer: true
// };

class UserProvider extends React.Component
{
  componentDidMount(){
    const dispatch = this.props.updateAuth;
    async function updateUserState() {
      auth.onAuthStateChanged( async userAuth => {
        dispatch(userAuth)
      });
    }
    updateUserState();
  }

    render(){
        return (
            <></>
        );
    }
}

const mapStateToProps = state => {
  return {
      user: state.user
  }
}

const mapDispatchToProps = (dispatch) => ({
  updateAuth: (userAuth) => dispatch(updateUserState(userAuth))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserProvider);
