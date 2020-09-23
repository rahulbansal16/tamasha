import React from 'react';
import {Container} from 'semantic-ui-react'
import EventGrid from './../component/EventGrid';
import {db} from '../firebase';
import AppHeader from '../component/AppHeader';
import AddProfileButton from '../component/AddProfileButton';
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
                <AppHeader/>
                {/* <EventGrid fetchEventResult={this.fetchPublicEvents} onCardClick = {this.onCardClick}/> */}
                <AddProfileButton/>
            </Container>
        );
    }
};
export default Home;
