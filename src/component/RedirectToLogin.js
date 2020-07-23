import React from 'react';
import {withRouter} from "react-router-dom";
import {UserContext} from '../UserProvider';

class RedirectToLogin extends React.Component {
    static contextType = UserContext;
    render(){
        if (!this.context.user){
            this.props.history.push({
                pathname:"/login",
                successUrl: this.props.location
            });
        } 
       return(<></>);
    }
  
}

export default withRouter(RedirectToLogin);
