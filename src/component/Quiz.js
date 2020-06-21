import React from 'react';
import { Header, Button } from 'semantic-ui-react'
import { withRouter } from "react-router-dom";
import {db} from "../firebase";

class Quiz extends React.Component {

    state = {
        question:"Hi How are you",
        options:['first','second', 'third', 'fourth'],
        id:'test',
        disabled:false
    }

    // Error creating your option and lets see what can be done from the user end
    postTheAnswer = (option) => {
        console.log("Posting the options for the question", option);
        this.setState({disabled: true});
    }

    componentDidMount = async() => {

        let question = db.collection('liveQuestions').doc(this.props.event);
        question.onSnapshot( docSnapshot =>{
            this.setState({...docSnapshot.data(), disabled:false})
        }, err => {
            console.log("The error is ", err);
        });

        let answer = db.collection('liveAnswers').doc(this.props.event);
        answer.onSnapshot( docSnapshot => {
            this.setState(docSnapshot.data());
        }, err => {
            console.log("The error is", err);
        })
    }

    render(){
        return(
            <>  
                <Header as="h4" content = {this.state.question} textAlign="center" ></Header>
                {
                    this.state.options.map( (option,idx) =>
                        (
                            idx%2 === 0?
                            <Button disabled={this.state.disabled} onClick = { () => this.postTheAnswer(option)} fluid>{option}</Button>:
                            <Button disabled={this.state.disabled} onClick = { () => this.postTheAnswer(option)} fluid>{option}</Button>
                        )
                    )
                }
            </>
        );
    }
}

export default withRouter(Quiz);
