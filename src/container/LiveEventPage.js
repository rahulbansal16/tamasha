import React from 'react';
import { Image, Card, Button, Container, Icon, Loader} from 'semantic-ui-react';
import {withRouter} from "react-router-dom";
import Quiz from '../component/Quiz'
import {db} from '../firebase';

class LiveEventPage extends React.Component {

    // TODO: Add the logic of highlighting the 
    // answer when the answer is revealed
    state = {
        eventStarted:true,
        answer:undefined
    }

    submitTheAnswer = async () => {
        // TODO: Make an API call to the server to submit it
    }

    componentDidMount = async () => {
        let id  = this.props.match.params.id
        let videoStreamUrl = this.props.location.videoStreamUrl;
        if (!videoStreamUrl){
            videoStreamUrl = (await db.collection('events').doc(id).get()).data().videoStreamUrl
        }
        this.setState({
            loading:false,
            videoStreamUrl:videoStreamUrl
        })
        // TODO:Create a reference to the Event to check if it has started or not
        // and after checking the state update the eventStarted to True
    };

    populateEvent = (id,answer) => {
        return(
                <>
                <iframe width="560" height="315" src={this.state.videoStreamUrl} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <Quiz event = {"fm"} answer={answer}/>
                </>
            );
    }

    eventNotLive = () => {
        return (
            <>
            The event is not yet started
            </>
        );
    }

    render () {
        let id  = this.props.match.params.id
        console.log("The id of the event is", id);
        return(
            <Container>
                {
                    this.state.eventStarted?
                    this.populateEvent(id):
                    this.eventNotLive()
                }
            </Container>
        );
    }
}
export default withRouter(LiveEventPage);