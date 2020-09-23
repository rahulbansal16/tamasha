import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import {withRouter} from "react-router-dom";


class AddProfileButton extends React.Component {

    createNewClass = () => {
        console.log("Create a New Class")
        this.props.history.push({
            pathname:"/profile"
        });
    }

    render(){
        return(<>
            <Button circular color="red" onClick = {this.createNewClass}>
                <Icon name="plus"/>
                Create Profile
            </Button>
        </>)
    }
}
export default withRouter(AddProfileButton);