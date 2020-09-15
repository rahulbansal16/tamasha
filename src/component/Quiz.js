import React from 'react';
import { withRouter } from "react-router-dom";
import {db} from "../firebase";
import AppLoader from './AppLoader';
import Question from './Question';
import Timer from './Timer';
import {connect} from "react-redux";
import {submitAnswer, updateQuestion, flashAnswer} from '../redux/actions';


class Quiz extends React.Component {

    state = {
        question:{  
            question: "Hi How are you ?",
            options: ['first','second', 'third', 'fourth'],
            questionId: 'test'
        },
        answer:'',
        disabled:false,
        isLoading: true,
    }
    // Error creating your option and lets see what can be done from the user end
    postTheAnswer = (option) => {
        submitAnswer({
            qid: this.props.question.questionId,
            optionSubmitted: option
        });
        console.log("Submitted the Answer");
        // TODO: Add a link to API Call
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
            console.log("The new snapshot is", docSnapshot);
            if ( docSnapshot === undefined || docSnapshot.data() === undefined || Object.entries(docSnapshot.data()).length === 0){
                return
            }
            if ( true || docSnapshot.data().questionId === this.props.question.questionId){
                flashAnswer(docSnapshot.data());
                // this.setState({
                    // ...docSnapshot.data(),
                    // });
            }
        }, err => {
            console.error("Failed in fetching the answer", err);
        })
    }

    registerToLiveQuestion = () => {
        let question = db.collection('liveQuestions').doc(this.props.event);
        question.onSnapshot( docSnapshot => {
            if ( docSnapshot === undefined || docSnapshot.data() === undefined || Object.entries(docSnapshot.data()).length === 0){
                return
            }
            updateQuestion(
                docSnapshot.data()
            );
            this.setState({
                isLoading: false
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
                <Question question = {this.props.question} 
                    disabled = {this.props.isAnswerSubmitted || this.props.isTimeout}
                    answer = {this.props.answer}
                    onClick = {this.postTheAnswer}
                    questionId = {this.props.qid}
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
const mapStateToProps = state => {
    const {
        timerDisabled,
        isAnswerSubmitted,
        optionSubmitted,
        qid,
        qText,
        options,
        resetTimer,
        isTimeout
    } = state.quiz;
    return {
        question: {
            question: qText,
            options: options,
            questionId: qid
        },
        timerDisabled,
        isAnswerSubmitted,
        optionSubmitted,
        resetTimer,
        isTimeout,
        qid
    };
}

export default connect(
    mapStateToProps,
    {submitAnswer, updateQuestion, flashAnswer}
)(withRouter(Quiz));
