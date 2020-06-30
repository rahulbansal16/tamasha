import React from 'react';
import { Image, Card, Button, Container, Icon, Loader, Header} from 'semantic-ui-react';
import {withRouter} from "react-router-dom";
import {db} from '../firebase';
import EventGrid from '../component/EventGrid';
// This will also populate the card like some user reference etc
// It should not be a big thing altogether

class UserPage extends React.Component {

    state = {
        loading:true,
        event:undefined
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
    };

    renderUserMenu = () => {
        return(
            <>
            </>
        );
    }

    onCardClick = async (id) => {
        console.log("Card got clicked")
        this.props.history.push({
            pathname:"/event/host/" + id,
            //  this.props.card.id,
            card: this.props.card
        });
    }
    // All these events will be fetched and these events belongs to the user
    fetchUserEvents = async () => {
        return await db.collection('events').get();
    }

    renderUserProfile = () => {
        return (
            <>
                <Header content="Upcoming Events"></Header>
                <EventGrid fetchEventResult = {this.fetchUserEvents} onCardClick = {this.onCardClick}/>
            </>
            );
    }

    render () {
        let id  = this.props.match.params.id
        console.log("The id of the event is", id);
        return(
            <Container>
                {this.state.loading? this.getLoader() : this.renderUserProfile()}
            </Container>
        );
    }
}

export default withRouter(UserPage);