import React from 'react';
import { Header, Button, Progress, Loader } from 'semantic-ui-react'
import { withRouter } from "react-router-dom";
import {db} from "../firebase";

class Quiz extends React.Component {

    state = {
        question:"Hi How are you",
        options:['first','second', 'third', 'fourth'],
        id:'test',
        disabled:false,
        timeLeft: 10,
        success: true,
        warning: false,
        error:false,
        percent: 100,
        isLoading: true
    }
    timer = null;

    // Error creating your option and lets see what can be done from the user end
    postTheAnswer = (option) => {
        console.log("Posting the options for the question", option);
        this.setState({disabled: true});
    }

    decreaseTime = () => {
        this.setState( (old) =>({
            timeLeft: old.timeLeft - 1,
            percent: ((old.timeLeft-1)/10.00)*100,
            success: old.timeLeft - 1 >= 8 ? true: false,
            error: old.timeLeft - 1 < 4 ? true: false,
            warning: old.timeLeft - 1 >= 4 && old.timeLeft -1 < 8 ? true: false,
            disabled: old.timeLeft - 1 === 0? true: false
        }));
    }

    componentDidMount = async() => {

        let question = db.collection('liveQuestions').doc(this.props.event);
        question.onSnapshot( docSnapshot =>{
            this.setState({...docSnapshot.data(), disabled:false, isLoading:false})
        }, err => {
            console.log("The error is ", err);
        });

        let answer = db.collection('liveAnswers').doc(this.props.event);
        answer.onSnapshot( docSnapshot => {
            this.setState(docSnapshot.data());
        }, err => {
            console.log("The error is", err);
        })

        this.timer = setInterval(this.decreaseTime , 1000);
        if (this.state.percent === 0 ) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    componentWillUnmount(){
        if(this.timer === null){
           clearInterval(this.timer) ;
           this.timer = null;
        }
    }

    renderQuizComponent = () => {
        return (
            <>  
                <Progress percent = {this.state.percent} success={this.state.success} error = {this.state.error} warning={this.state.warning} />
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
        )
    }

    showLoader = () => {
        return (
            <>
                <Loader/>
            </>
        );
    }

    render(){
        return(
            <>  
            {this.state.isLoading?this.showLoader():this.renderQuizComponent()}
            </>
        );
    }
}

export default withRouter(Quiz);
