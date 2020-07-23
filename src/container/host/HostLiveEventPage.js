import React from 'react';
import {Header, Button, Icon, Grid, Segment} from 'semantic-ui-react';
import {withRouter} from "react-router-dom";
import {db} from '../../firebase';
import AppLoader from '../../component/AppLoader';
import Quiz from '../../component/Quiz';
import AuthButton from '../../component/AuthButton';
import Question from '../../component/Question';

class HostLiveEventPage extends React.Component {

    state = {
        loading:true,
        eventStarted:true,
        answer:undefined,
        questionNumber:0,
        currentQustion:undefined,
        revealAnswer:false,
        nextQuestion:undefined,
        fetchNextQuestion:'',
        question:undefined
    }

    componentDidMount = async () => {
        let id  = this.props.match.params.id
        this.setState({
            loading:false,
        })
    };

    nextQuestionHandler = () => {
    }

    revealAnswerHandler = () => {
    }

    render () {
        let id  = this.props.match.params.id
        console.log("The id of the event is", id);
        return(
            <div>
                <AppLoader loading={this.state.loading}>
                    <Header content="This is the host live page"></Header>
                    <Question />
                    <Quiz event = {"fm"}/>
                    <div style = {{ display:'flex', flexWrap:'wrap', marginTop:'8px'}}>
                        <div style = {{display:'flex',width:'100%'}}>
                            <Button fluid floated="left" icon labelPosition='right' onClick={this.nextQuestionHandler}>Next Question<Icon name="arrow right"></Icon></Button>
                            <Button fluid floated="right" icon labelPosition='right' onClick={this.revealAnswerHandler}>Reveal Answer<Icon name="bell outline"></Icon></Button>                    
                        </div>
                        <Button fluid negative><Icon name="arrow"></Icon> End Contest</Button>
                    </div>                        
                </AppLoader>
            </div>
        );
    }

}
export default withRouter(HostLiveEventPage);