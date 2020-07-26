import React from 'react';
import { Image, Card, Button, Container, Icon, Header} from 'semantic-ui-react';
import AppLoader from "../../component/AppLoader"
import {withRouter} from "react-router-dom";
import {db} from '../../firebase';
import HostLiveEventPage from './HostLiveEventPage';
// import {UserContext} from '../../../UserProvider';

// TODO: Figure out a way to fetch the user info from the cards
class HostEventPage extends React.Component {

    // static contextType = UserContext;
    state = {
        loading: true,
        event:undefined,
        eventStarted: false
    };

    redirectToLive = () => {
        this.props.history.push({
            pathname: this.props.location.pathname + '/live',
            // videoStreamUrl: this.state.event.videoStreamUrl,
            event: this.state.event
        })  
    }

    editEvent = () => {
        this.props.history.push({
            pathname: this.props.location.pathname + '/edit',
            event: this.state.event
        })
    }

    componentDidMount = async () => {
        let id  = this.props.match.params.id
        let eventData = this.props.location.card;
        if (!eventData){
            eventData = (await db.collection('events').doc(id).get()).data()
        }
        this.setState({
            loading: false,
            event:eventData
        })
        // TODO:Create a reference to the Event to check if it has started or not
        // and after checking the state update the eventStarted to True
    };

    populateEventInfo = (event) => {
        if(!event) return;
        const {name, description} = event;
        return (
            <>
                <Header content="Host Event Page"></Header>
                <Card fluid>
                    <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false} />
                    <Card.Content>
                        <Card.Header>{name}</Card.Header>
                        <Card.Meta>16 June 2020 at 7 pm</Card.Meta>
                        <Card.Description>{description}</Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Button onClick={this.startEvent}>Start Event</Button>
                        <Button onClick={this.editEvent}>Edit Event</Button>
                    </Card.Content>
                </Card>
            </>
            );
    }

    startEvent = () => {
        this.redirectToLive();
    }
    populateEvent = () => {
        const eventStarted = this.state.eventStarted;
        return (
            <div>
                {eventStarted?
                this.redirectToLive():
                this.populateEventInfo(this.state.event)}:
            </div>
        )
    }

    render () {
        return (
            <Container>
                <AppLoader loading={this.state.loading}>
                    {this.populateEvent()}
                </AppLoader>
            </Container>
        );
    }
}
export default withRouter(HostEventPage);