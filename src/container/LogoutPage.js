import React from 'react';
import {Card, Container, Loader} from 'semantic-ui-react';
import {withRouter} from "react-router-dom";
import {auth} from '../firebase';
import {updateUserState} from '../redux/actions';
import {connect} from "react-redux";

// TODO:Add the Logout Page to the User Menu also
class LogoutPage extends React.Component {

    state = {loading:true};

    getLoader = () => {
        return (
            <Loader active inline="centered" content="Logging You Out"></Loader>
        );
    }

    componentDidMount = () => {
        const dispatch = this.props.updateAuth;
        auth.signOut().then( () => {
            this.redirectToHome()
            dispatch();
        } ).catch(() => {
            console.log('Error Logging you out');
        })
    };

    redirectToHome = () => {
        this.props.history.push({pathname:"/home"});
    }

    render () {
        return(
            <Container>
                {this.state.loading? this.getLoader() : this.populateTheCard()}
            </Container>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    updateAuth: (userAuth) => dispatch(updateUserState(userAuth))
})

export default connect(null, mapDispatchToProps)(withRouter(LogoutPage));