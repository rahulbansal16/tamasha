import React from 'react';
import { auth } from '../firebase';
import firebase from 'firebase';
// import {UserConsumer} from './UserProvider';
import { withRouter } from "react-router-dom";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import FirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Segment, Icon, Header } from 'semantic-ui-react';


let uiConfig = {
    // signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    // TODO: The successUrl should be the page which initiated the login.
    signInSuccessUrl: '/signedIn',
    signInSuccessWithAuthResult:  function(authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        console.log("The signin successful");
        return true;
      },

    signInOptions: [ { 
            provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
            defaultCountry:'IN',
            recaptchaParameters: {
                type: 'image', // 'audio'
                size: 'normal', // 'invisible' or 'compact'
                badge: 'bottomleft' //' bottomright' or 'inline' applies to invisible.
              },
            requireDisplayName: true,
            signInSuccessWithAuthResult: function(authResult, redirectUrl){
                console.log("Success", authResult);
            }

        },
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ]
  };


class Login extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            email:'',
            password:''
        }
    }

    handleChange = (event, data) => {
        const {name,value} = event.target;
        if (this.state.hasOwnProperty(name)) {
          this.setState({ [name]: value.toLowerCase()});
        }
    }

    render(){
        // TODO: Fix the redirect for the google sign in also
        if ( this.props.location.successUrl ){
            uiConfig["signInSuccessUrl"] = this.props.location.successUrl.pathname;
        }

        return(
            // <Segment className="centerIt" style= {{marginLeft:'10px', marginRight:'10px'}}>
            <>
                {/* <Icon name ="cart" size="massive" color ="purple"></Icon> */}
                <Header as = "h3" textAlign="center">Tamasaha Live</Header>
                <Header as = "h3" textAlign="center">Please Login to continue</Header>
                <Icon style ={{width:'100%'}} name = "sign in" size="massive"></Icon>
                <FirebaseAuth style={{width:'100% !important'}}uiConfig={uiConfig} firebaseAuth={auth}/>
            </>
            // </Segment>
        );
    }

    // googleSignIn = () => {
    //     signInWithGoogle();
    // }

    // signInWithEmailAndPasswordHandler = (event) => {
    //     event.preventDefault();
    //     auth.signInWithEmailAndPassword(this.state.email, this.state.password).catch(error => {
    //       console.error("Error signing in with password and email", error);
    //     });
    // };

    // sendResetEmail = event => {
    //     event.preventDefault();
    //     auth
    //       .sendPasswordResetEmail(this.state.email)
    //       .then(() => {
    //         // setEmailHasBeenSent(true);
    //         // setTimeout(() => {setEmailHasBeenSent(false)}, 3000);
    //       })
    //       .catch((error) => {
    //         console.log("Error sending up the Reset Email", error);
    //         // setError("Error resetting password");
    //       });
    //   };

};
export default withRouter(Login);
