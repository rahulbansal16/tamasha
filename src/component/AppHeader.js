import React from 'react';
import {withRouter} from "react-router-dom";
import {Header} from 'semantic-ui-react';


class AppHeader extends React.Component {

    render(){
        return (
            <div className ="fadeInUp">
                    <Header as='h1' content = "Better Education Project" style = {{marginBottom:'0px'}}></Header>
                    <Header as= 'h3' content = "Learn From the Best" style = {{marginTop:'0px'}}></Header>
            </div >
        );
    }
}

export default withRouter(AppHeader);

