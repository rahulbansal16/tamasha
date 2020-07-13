import React from 'react';
import { withRouter } from "react-router-dom";
import {db} from "../firebase";
import AppLoader from './AppLoader';
import Question from './Question';
import Timer from './Timer';
import {UserContext} from '../UserProvider';


class Quiz extends React.Component {
    static contextType = UserContext

    state = {
        question:{  
            question: "Hi How are you ?",
            options: ['first','second', 'third', 'fourth'],
            questionId: 'test'
        },
        answer:'',
        disabled:false,
        isLoading: true,
        enableFlashing: false,
    }
    // Error creating your option and lets see what can be done from the user end
    postTheAnswer = (option) => {
        console.log("Posting the options for the question", option);
        this.setState({disabled: true});
    }

    componentDidMount = async() => {
        this.registerToLiveQuestion();
        this.registerToLiveAnswer();
    }

    disableSubmission = () => {
        this.setState({
            disabled:true
        })
    }

    registerToLiveAnswer = () => {
        let answer = db.collection('liveAnswers').doc(this.props.event);
        answer.onSnapshot( docSnapshot => {
            if ( docSnapshot.data().questionId === this.state.questionId){
                this.setState({
                    ...docSnapshot.data(),
                    enableFlashing: true});
            }
        }, err => {
            console.error("Failed in fetching the answer", err);
        })
    }

    registerToLiveQuestion = () => {
        let question = db.collection('liveQuestions').doc(this.props.event);
        question.onSnapshot( docSnapshot => {
            this.setState({
                    question: docSnapshot.data(),
                    disabled:false,
                    isLoading:false
            })
        }, err => {
            console.log("Failed in fetching the question ", err);
        });
    }

    // Flash Color using some other properties that I have to f
    flashColor = (id, initial, final) => {
    }

    renderQuizComponent = () => {
        if(this.state.isLoading){
            return;
        }
        return (
            <>  
                <Timer percent={100} onComplete={this.disableSubmission}/>
                <Question question = {this.state.question} 
                    // options = {this.state.options}
                    disabled = {this.state.disabled}
                    answer = {this.state.answer}
                    onClick = {this.postTheAnswer}
                    questionId = {this.state.questionId}
                />
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
