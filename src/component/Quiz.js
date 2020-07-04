import React from 'react';
import { Header, Button, Progress } from 'semantic-ui-react'
import { withRouter } from "react-router-dom";
import {db} from "../firebase";
import AppLoader from './AppLoader';

class Quiz extends React.Component {
    timer = 20*1000;// miliseconds
    timerInterval = 1000/40; // miliseconds
    timerMethod = null; // variable for setting the setTimer
    state = {
        question:"Hi How are you",
        options:['first','second', 'third', 'fourth'],
        id:'test',
        disabled:false,
        timeLeft: this.timer,
        success: true,
        warning: false,
        error:false,
        percent: 100,
        timerDisabled: false,
        isLoading: true
    }
    // Error creating your option and lets see what can be done from the user end
    postTheAnswer = (option) => {
        console.log("Posting the options for the question", option);
        this.setState({disabled: true});
    }

    decreaseTime = () => {
        this.setState( (old) =>({
            timeLeft: old.timeLeft - this.timerInterval,
            percent: ((old.timeLeft- this.timerInterval)/this.timer )*100,
            success: old.timeLeft - this.timerInterval >= 8 ? true: false,
            error: old.timeLeft - this.timerInterval < 4*1000 ? true: false,
            warning: old.timeLeft - this.timerInterval >= 4*1000 && old.timeLeft - this.timerInterval < 8 ? true: false,
            disabled: old.timeLeft - this.timerInterval === 0? true: false,
            timerDisabled: ((old.timeLeft- this.timerInterval)/this.timer ) === 0
        }));
    }

    componentDidMount = async() => {

        let question = db.collection('liveQuestions').doc(this.props.event);
        question.onSnapshot( docSnapshot =>{
            this.setState({
                ...docSnapshot.data(),
                 disabled:false,
                  isLoading:false
            })
        }, err => {
            console.log("The error is ", err);
        });

        let answer = db.collection('liveAnswers').doc(this.props.event);
        answer.onSnapshot( docSnapshot => {
            this.setState(docSnapshot.data());
        }, err => {
            console.log("The error is", err);
        })

        this.timerMethod = setInterval(this.decreaseTime , this.timerInterval);
        if (this.state.percent === 0 ) {
            clearInterval(this.timerMethod);
            this.timerMethod = null;
        }
    }

    componentWillUnmount(){
        if(this.timerMethod !== null){
           clearInterval(this.timerMethod) ;
           this.timerMethod = null;
        }
    }

    renderQuizComponent = () => {
        if(this.state.isLoading){
            return;
        }
        return (
            <>  
                <Progress percent = {this.state.percent} success={this.state.success} error = {this.state.error} warning={this.state.warning} disabled={this.state.timerDisabled}/>
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

    render(){
        return(
            <>
            <AppLoader loading = {this.state.isLoading} text = {"Loading Questions"}>
                {this.renderQuizComponent()}
            </AppLoader>
            </>
        );
    }
}

export default withRouter(Quiz);
