import React from 'react';
import { Menu, Icon, Header, Button, Segment } from 'semantic-ui-react'
import { withRouter } from "react-router-dom";
import {firestore} from "../firebase";

class Quiz extends React.Component {

    state = {
        question:"Hi How are you",
        options:['first','second', 'third', 'fourth']
    }

    componentDidMount = async() => {
        // TODO: Listen to the questions from the database
        // const question = firestore.chid(`livequestions/${this.props.event}/live`)
        // question.on('value', snap => {
        //         this.setState({
        //             question: snap.question,
        //             options: snap.options
        //         });
        // })
    }
    // Populate the color so that it can be set to something
    // great and wants to do something bigger

    render(){
        return(
            <>  
                <Header as="h4" content = {this.state.question} textAlign="center" ></Header>
                {
                    this.state.options.map( (option,idx) =>
                        (
                            idx%2 === 0?
                            <Button fluid>{option}</Button>:
                            <Button primary fluid>{option}</Button>
                        )
                    )
                }
            </>
        );
    }
}

export default withRouter(Quiz);
