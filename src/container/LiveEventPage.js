import React from 'react';
import {Container} from 'semantic-ui-react';
import {withRouter} from "react-router-dom";
import Quiz from '../component/Quiz'
import {db} from '../firebase';
import {EventStatus} from '../Const';
import AppLoader from '../component/AppLoader';

// Add a column telling the user that the event has not started yet and
class LiveEventPage extends React.Component {

    // TODO: Add the logic of highlighting the 
    // answer when the answer is revealed
    state = {
        eventStatus: EventStatus.UPCOMING,
        answer:undefined,
        event: undefined,
        loading: true
    }

    submitTheAnswer = async () => {
        // TODO: Make an API call to the server to submit it
    }

    componentDidMount = async () => {
        let id  = this.props.match.params.id
        let videoStreamUrl = this.props.location.videoStreamUrl;
        let event = this.props.location.event;
        if (!videoStreamUrl){
            event = (await db.collection('events').doc(id).get()).data()
        }
        this.setState({
            loading: false,
            videoStreamUrl: event.videoStreamUrl,
            event: event,
            // TODO: Add a field called eventStatus in the event json
            eventStatus: event.eventStatus
        })
    };

    populateEvent = (id,answer) => {
        return(
                <>
                <iframe title = {this.state.event.name} width="560" height="315" src={this.state.videoStreamUrl} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <Quiz event = {id || 'fm'} answer={answer}/>
                </>
            );
    }

    eventNotLive = () => {
        return (
            <>
                The Event is not live yet. 
                Please wait for some time.
                Once the show gets over.
            </>
        );
    }

    render () {
        let id  = this.props.match.params.id
        console.log("The id of the event is", id);
        return(
            <Container>
                <AppLoader loading = {this.state.loading}>
                    {
                        this.state.eventStatus === EventStatus.LIVE?
                        this.populateEvent(id):
                        this.eventNotLive()
                    }
                </AppLoader>
            </Container>
        );
    }
}
export default withRouter(LiveEventPage);