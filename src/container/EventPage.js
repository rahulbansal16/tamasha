import React from 'react';
import { Image, Card, Container, Button} from 'semantic-ui-react';
import {withRouter} from "react-router-dom";
import AppLoader from '../component/AppLoader'
import {db} from '../firebase';
import AuthButton from '../component/AuthButton';
import {connect} from "react-redux";
import {PaymentStatus, EventStatus} from '../Const'
import { updateEvent } from '../redux/actions';
import {fetchEvent} from '../main/eventService';
import {fetchPaymentStatus} from '../main/paymentService'

// This can be improved to the action so that the user can go to the next action
const BUTTON_TYPE = {
    LOGIN_BUTTON:'login_button',
    PAYMENT_BUTTON:'payment_button',
    GO_TO_CLASS_BUTTON: 'go_to_class_button'
}

const BUTTON_TEXT = {
    LOGIN : 'Login',
    GO_TO_CLASS:'Go To Class'
}


class EventPage extends React.Component {

    state = {
        loading:true,
        event:undefined,
        eventStatus: EventStatus.UPCOMING,
        paymentStatus: PaymentStatus.PENDING,
        buttonType: BUTTON_TYPE.LOGIN_BUTTON
        //  this.props.user? BUTTON_TYPE.PAYMENT_BUTTON : BUTTON_TYPE.LOGIN_BUTTON
    };

    componentDidMount = async () => {
        console.log("Calling the: -- componentDidMount");
        const eventId = this.props.match.params.id;
        let event = this.props.location.card;
        if (!event)
            event = await fetchEvent(eventId)
        const status = await fetchPaymentStatus(eventId);
        // let textOnButton = "Join at Rs " + (event.entryFee || 50).toString();
        // if (status) {
        //     textOnButton = "Go To Class";
        // }
        this.setState({
            loading:false,
            event:event,
            eventStatus: (event || EventStatus.UPCOMING).status,
            paymentStatus: status,
            buttonType: this.getTheButtonType(status)
        })
        this.props.updateEvent(this.props.match.params.id);
        if ( this.state.buttonType === BUTTON_TYPE.PAYMENT_BUTTON ){
            let script = document.createElement('script')
            script.setAttribute('src', 'https://cdn.razorpay.com/static/widget/payment-button.js')
            script.setAttribute('data-payment_button_id', 'pl_FclrxFUxn99j1s')
            script.async = true;
            document.getElementById('razor').append(script)
        }
    };

    getTheButtonType = (status)=>{
        if ( this.props.user === null) {
            return BUTTON_TYPE.LOGIN_BUTTON
        }
        if ( !status || status === PaymentStatus.PENDING ){
            return BUTTON_TYPE.PAYMENT_BUTTON
        }
        if (status === PaymentStatus.RECEIVED)
            return BUTTON_TYPE.GO_TO_CLASS_BUTTON;
    }

    isEventStarted = () => {
        return (this.state.event || false).status
    }

    // TODO: Add the flow where the user is taken to the 
    // payment page and from there the user is taken to do somthing

    takeToLivePage = () => {
        if (this.state.paymentStatus === PaymentStatus.PENDING){
            console.log("Redirecting to the payment page");
            return
        }
        else if (true
            // this.state.paymentStatus === PaymentStatus.RECEIVED &&
            // this.state.eventStatus === EventStatus.LIVE
            ){
           console.log("Redirecting to the live Event page")
            this.props.history.push({
                pathname: this.props.location.pathname + '/live',
                videoStreamUrl: this.state.event.videoStreamUrl,
                event: this.state.event
            })  
       }
    }

    createPaymentButton = () => {
        console.log("Calling the createPaymenyButton: -- createPaymentButton")
        return <form id ="razor"></form>
    }

    showButton = () => {

        switch(this.state.buttonType){
            case BUTTON_TYPE.LOGIN_BUTTON:
                return <AuthButton unAuthText={BUTTON_TEXT.LOGIN}></AuthButton>
            case BUTTON_TYPE.PAYMENT_BUTTON:
                return this.createPaymentButton()
            case BUTTON_TYPE.GO_TO_CLASS_BUTTON:
                return <Button onClick={this.takeToLivePage}>{BUTTON_TEXT.GO_TO_CLASS}</Button>
        }
    }

    populateEventInfo = (event) => {
        if(!event) return;
        const {name, description, imgSrc} = event;
        return (<>
                <Card className="fadeInUp" fluid>
                    <Image src= {imgSrc}
                     wrapped ui={false} />
                    <Card.Content>
                        <Card.Header>{name}</Card.Header>
                        <Card.Meta>16 June 2020 at 7 pm</Card.Meta>
                        <Card.Description>{description}</Card.Description>
                    </Card.Content>

                    {/* <Card.Content extra>
                        <AuthButton onClick={this.onClick} unAuthText={"Register"} authText={this.state.buttonText}/>
                    </Card.Content> */}

                    <Card.Content>
                        {
                            this.showButton()
                        }
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

const mapStateToProps = state => {
    return {
        user: state.user,
        event: state.event
    }
}

const mapDispatchToProps = (dispatch) => ({
    updateEvent: (eventId) => dispatch(updateEvent(eventId))
  })

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(EventPage));
