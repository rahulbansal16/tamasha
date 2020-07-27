/* eslint-disable no-unreachable */
import React from 'react';
import {Card, Button, Icon, Image, Transition} from 'semantic-ui-react';
// import CalendarPopup from './CalendarPopup';
import { withRouter } from "react-router-dom";
import LazyImage from './LazyImage';

class Event extends React.Component {

    addEventToCalendar = (event) => {
        console.log("Add event to calendear");
        event.stopPropagation();
    }

    formatAMPM = (date) => {
        return;
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
      }

    // TODO: Removed this, it is just for reference for the 
    // cardClicked = () => {
    //     console.log("Card got clicked")
    //     this.props.history.push({
    //         pathname:"/event/" + this.props.card.id,
    //         card: this.props.card
    //     });
    // }

    cardExampleCard = ({name, id, description}) => (
      // <Transition visible animation="fly up" duration={50000}>
        <Card className="fadeInUp" fluid as ='a' onClick = { () => this.props.onCardClick(this.props.card.id)}>
          <LazyImage src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false} 
          size = "medium"/>
          <Card.Content>
            <Card.Header>{name}</Card.Header>
            <Card.Meta>
              <span className='date'>September 2020</span>
            </Card.Meta>
            <Card.Description>
              {description}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Icon name='user' />
            22 Registration
            {this.props.children}
          </Card.Content>
        </Card>
        // </Transition>
      )
      
 
    render(){
        const {title, author, description, attending, id, startEpoch} = {
            title: 'Hi',
            author:'Rahul Bansal',
        };
        return this.cardExampleCard(this.props.card);
    }
};
export default withRouter(Event);