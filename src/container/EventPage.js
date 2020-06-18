import React from 'react';
import { Image, Card, Button, Container, Icon, Loader} from 'semantic-ui-react';
import {withRouter} from "react-router-dom";
import { getEventsById } from "../firebase";
import {UserContext} from '../UserProvider';
import LiveEventPage from '../container/LiveEventPage';

class EventPage extends React.Component {

    static contextType = UserContext;
    state = {
        loading:true,
        event:undefined,
        eventStarted: true
    };

    getLoader = () => {
        return (
            <Loader active inline="centered" content="Spinning up the Magic"></Loader>
        );
    }

    componentDidMount = async () => {
        let id  = this.props.match.params.id
        // TODO: Replace it with actual DB call
        // let event = getEventsById(id);
        let event = undefined
        this.setState({
            loading:false,
            event:event
        })
        // TODO:Create a reference to the Event to check if it has started or not
        // and after checking the state update the eventStarted to True
    };

    // TODO: Add the flow where the user is taken to the 
    // payment page and from there the user is taken to do somthing
    // big and impactful
    redirectToLogin = () => {
        console.log("The event join button got clicked", this.context);
        if (!this.context){
            this.props.history.push({
                pathname:"/login",
                successUrl: this.props.location
            });
        }
    }

    isEventStarted = () => {
        return true;
    }

    // TODO: Removed this function since it is moved to the
    // new router page
    populateEvent = () => {
        const eventStarted = this.state.eventStarted;
        // TODO: Move this method to the LiveEventPage,
        // create a component that checks if the authentication is required
        // if required it automatically redirects the user to the login page
        // and once the login is done it displays the page automatically
        if(eventStarted){
            this.redirectToLogin();
        }
        return (
            <div>
                {eventStarted?<LiveEventPage/>:this.populateEventInfo()}
            </div>
        )
    }

    populateEventInfo = () => {
        return (
                <Card fluid>
                    <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false} />
                    <Card.Content>
                        <Card.Header>Poker Live</Card.Header>
                        <Card.Meta>16 June 2020 at 7 pm</Card.Meta>
                        <Card.Description>Play your favourite poker game and get a chance to win your goodies</Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Button primary onClick = {this.redirectToLogin}><Icon name="shop"></Icon>
                            {this.context? "Play" : "Join"}
                        </Button>
                    </Card.Content>
                </Card>
            );
    }

    render () {
        let id  = this.props.match.params.id
        console.log("The id of the event is", id);
        return (
            <Container>
                {this.state.loading? this.getLoader() : this.populateEventInfo()}
            </Container>
        );
    }
}
// EventPage.contextType = UserConsumer;
export default withRouter(EventPage);