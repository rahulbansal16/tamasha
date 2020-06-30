import React from 'react';
import {Header, Container, Loader} from 'semantic-ui-react'
import EventGrid from './../component/EventGrid';
import {db} from '../firebase';
class Home extends React.Component {

    fetchPublicEvents = async () => {
        return await db.collection('events').get();
    }

    onCardClick = async (id) => {
        console.log("Card got clicked")
        this.props.history.push({
            pathname:"/event/" + id,
            //  this.props.card.id,
            card: this.props.card
        });
    }

    render(){
        return(
            <Container fluid>
                <Header textAlign='center' as='h1' content="Tamasha Live"/>
                <EventGrid fetchEventResult={this.fetchPublicEvents} onCardClick = {this.onCardClick}/>
            </Container>
        );
    }
};
export default Home;
