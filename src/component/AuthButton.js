import { Button, Icon } from "semantic-ui-react";
import React from 'react';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {submitAnswer, updateQuestion, flashAnswer} from '../redux/actions';

class AuthButton extends React.Component {

    onClick = () => {
        let user = this.props.user;
        if (!user){
            this.props.history.push({
                pathname:"/login",
                successUrl: this.props.location
            });
        } else {
            this.props.onClick();
        }
    }

    render() {
        let user = this.props.user;
        return (
            <Button primary onClick = {this.onClick}>
                <Icon name="shop"></Icon>
                {user? this.props.authText || this.props.unAuthText: this.props.unAuthText || this.props.authText}
            </Button>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(
    mapStateToProps,
    {submitAnswer, updateQuestion, flashAnswer}
)(withRouter(AuthButton));
