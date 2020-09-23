import React from 'react';
import {Card, Button, Icon, Image, Transition} from 'semantic-ui-react';
import { withRouter } from "react-router-dom";

class Profile extends React.Component {

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


    cardExampleCard = ({name, id, description, imgSrc}) => (
      // <Transition visible animation="fly up" duration={50000}>
        <Card className="fadeInUp" fluid as ='a' onClick = { () => this.props.onCardClick(this.props.card.id)}>
          <LazyImage src={imgSrc}
          
          // 'https://react.semantic-ui.com/images/avatar/large/matthew.png'
           wrapped ui={false} 
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
export default withRouter(Profile);