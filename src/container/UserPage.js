import React from 'react';
import { Image, Card, Button, Container, Icon, Loader} from 'semantic-ui-react';
import {withRouter} from "react-router-dom";
import { getEventsById } from "../firebase";
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

    upcomingEvents = () => {
        return (
                <Card fluid>
                    <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false} />
                    <Card.Content>
                        <Card.Header>Poker Live</Card.Header>
                        <Card.Meta>16 June 2020 at 7 pm</Card.Meta>
                        <Card.Description>Play your favourite poker game and get a chance to win your goodies</Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Button primary><Icon name="shop"></Icon>
                            Join
                        </Button>
                    </Card.Content>
                </Card>
            );
    }

    render () {
        let id  = this.props.match.params.id
        console.log("The id of the event is", id);
        return(
            <Container>
                {this.state.loading? this.getLoader() : this.populateTheCard()}
            </Container>
        );
    }
}

export default withRouter(UserPage);