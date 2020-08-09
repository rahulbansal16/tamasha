import React from 'react';
import {Header, Button, Icon, Container} from 'semantic-ui-react';
import {withRouter} from "react-router-dom";
import Quiz from '../../component/Quiz';
import IQSummary from '../../component/host/IQSummary'
import {functions} from '../../firebase';
import {EventStatus} from '../../Const';



class HostLiveEventPage extends React.Component {

    state = {
        loading:true,
        eventStarted:true,
        answer:undefined,
        revealAnswer:false,
        nextQuestion:undefined,
        fetchNextQuestion:'',
    }
    order = 0;

    componentDidMount = async () => {
    };


    nextQuestionHandler = async () => {
        console.log("Pushing the next Question");
        try {
          const pushNextQuestion = functions.httpsCallable('pushNextQuestion');
          const res = await pushNextQuestion({eventId: this.props.match.params.id,
            order: this.order
        });
          this.order = this.order + 1;
          return res
        }
        catch (err){
          console.error("Error pushing the next question", err);
          return undefined;
        }
      }

    revealAnswerHandler = async () => {
        console.log("Revealing the answer");
        console.log("Pushing the next Question");
        try {
          const revealAnswer = functions.httpsCallable('revealAnswer');
          const res = await revealAnswer({
            eventId: this.props.match.params.id,
            questionId: 'bgJv6mDpQj456yN4GxzR'
            });
          return res
        }
        catch (err){
          console.error("Error in revealingAnswer", err);
          return undefined;
        }
    }

    endEvent = async () => {
      try {
          const updateEventStatus = functions.httpsCallable('updateEventStatus');
          let result = await updateEventStatus({
              eventId: this.props.match.params.id,
              eventStatus: EventStatus.ENDED
          });
          const endContest = functions.httpsCallable('endContest');
          await endContest({
            eventId: this.props.match.params.id,
          });
          console.log("Error in changing the Event Status", result);
      }
      catch (err){
          console.error("Unable to update the status of the events", err);
      } 
  }

    render () {
        let id  = this.props.match.params.id
        console.log("The id of the event is", id);
        return(
            <Container>
              <Header content="This is the host live page"></Header>
              <Quiz event = {id}/>
              <div style = {{ display:'flex', flexWrap:'wrap', marginTop:'8px'}}>
                  <div style = {{display:'flex',width:'100%'}}>
                      <Button fluid floated="left" icon labelPosition='right' onClick={this.nextQuestionHandler}>Next Question<Icon name="arrow right"></Icon></Button>
                      <Button fluid floated="right" icon labelPosition='right' onClick={this.revealAnswerHandler}>Reveal Answer<Icon name="bell outline"></Icon></Button>                    
                  </div>
                  <Button fluid negative onClick = {this.endEvent}><Icon name="arrow right"></Icon> End Contest</Button>
              </div>
              <IQSummary/>                
            </Container>
        );
    }

}
export default withRouter(HostLiveEventPage);