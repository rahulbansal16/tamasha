import { Button, Icon } from "semantic-ui-react";
import React from 'react';
import {UserContext} from '../UserProvider';
import {withRouter} from "react-router-dom";


class AuthButton extends React.Component {

    static contextType = UserContext;
    onClick = () => {
        if (!this.context){
            this.props.history.push({
                pathname:"/login",
                successUrl: this.props.location
            });
        } else {
            this.props.onClick();
        }
    }

    render() {
        return (
            <Button primary onClick = {this.onClick}>
                <Icon name="shop"></Icon>
                {this.context? this.props.authText || this.props.unAuthText: this.props.unAuthText || this.props.authText}
            </Button>
        )
    }
}

export default withRouter(AuthButton);