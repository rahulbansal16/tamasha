import React from 'react';
import {withRouter} from "react-router-dom";
import {Loader} from 'semantic-ui-react';


class AppLoader extends React.Component {

    render(){
        const child = this.props.children;
        return(<> 
        {
        this.props.loading?
            <Loader active inline="centered" content= {this.props.text || "Running the Loader"}>
            </Loader>
            :child
        } 
        </>);
    }
}

export default withRouter(AppLoader);

