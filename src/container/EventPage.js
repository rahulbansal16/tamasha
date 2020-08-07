import React from 'react';
import { Image, Card, Container} from 'semantic-ui-react';
import {withRouter} from "react-router-dom";
import AppLoader from '../component/AppLoader'
import {db} from '../firebase';
import AuthButton from '../component/AuthButton';
import {functions} from '../firebase';
import {PaymentStatus, EventStatus} from '../Const'
class EventPage extends React.Component {

    state = {
        loading:true,
        event:undefined,
        eventStatus: EventStatus.UPCOMING,
        buttonText:'Play',
        paymentStatus: PaymentStatus.PENDING
    };

    componentDidMount = async () => {
        const event = await this.fetchEvent()
        const status = await this.fetchPaymentStatus();
        let textOnButton = "Join at Rs " + (event.entryFee || 50).toString();
        if (status) {
            textOnButton = "Play";
        }
        this.setState({
            loading:false,
            event:event,
            eventStatus: (event || EventStatus.UPCOMING).status,
            paymentStatus: status,
            buttonText: textOnButton
        })
    };

    fetchEvent = async () => {
        let id = this.props.match.params.id;
        let eventData = this.props.location.card;
        if (!eventData){
            try {
                eventData = (await db.collection('events').doc(id).get()).data()
            }
            catch(err){
                console.error("Error fetching the event", err)
            }
        }
        return eventData
    }


    fetchPaymentStatus = async () => {
      try {
        const paymentStatus = functions.httpsCallable('fetchUserPayment');
        let res = await paymentStatus({eventId: this.props.match.params.id});
        return res.data.paymentStatus
      }
      catch (err){
        console.error("Error fetching the payment status", err);
        return undefined;
      }
    }

    isEventStarted = () => {
        return (this.state.event || false).status
    }

    // TODO: Add the flow where the user is taken to the 
    // payment page and from there the user is taken to do somthing

    onClick = () => {
        if (this.state.paymentStatus === PaymentStatus.PENDING){
            console.log("Redirecting to the payment page");
        }
        if (this.state.paymentStatus === PaymentStatus.RECEIVED &&
            this.state.eventStatus === EventStatus.LIVE){
           console.log("Redirecting to the live Event page")
            this.props.history.push({
                pathname: this.props.location.pathname + '/live',
                videoStreamUrl: this.state.event.videoStreamUrl,
                event: this.state.event
            })  
       }
    }

    populateEventInfo = (event) => {
        if(!event) return;
        const {name, description} = event;
        return (<>
                <Card className="fadeInUp" fluid>
                    <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false} />
                    <Card.Content>
                        <Card.Header>{name}</Card.Header>
                        <Card.Meta>16 June 2020 at 7 pm</Card.Meta>
                        <Card.Description>{description}</Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <AuthButton onClick={this.onClick} unAuthText={"Register"} authText={this.state.buttonText}/>
                    </Card.Content>
                </Card>
                </>
            );
    }

    render () {
        return (
            <Container>
                <AppLoader loading={this.state.loading}>
                    {this.populateEventInfo(this.state.event)}
                </AppLoader>
            </Container>
        );
    }
}
// EventPage.contextType = UserConsumer;
export default withRouter(EventPage);