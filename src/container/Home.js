import React from 'react';
import { Icon, Step, Header, Button, Message, Transition, Segment, Container } from 'semantic-ui-react'
import EventGrid from './../component/EventGrid';

// import {UserConsumer} from './UserProvider';
// import { withRouter } from "react-router-dom";

class Home extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            step:'order'
        }
    }

    handleChange = (event, data) => {
        const {name,value} = event.target;
        if (this.state.hasOwnProperty(name)) {
          this.setState({ [name]: value.toLowerCase()});
        }
    }

    render(){
        const {step} = this.state;
        return(
            <Container fluid>
                <Header textAlign='center' as='h1' content="Tamasha Live"/>
                <EventGrid/>
            </Container>
        );
    }

    // AddOrder = () => {
    //     return (
    //         <>
    //         <input id = "image" type="file" name="image" accept="image/*" capture="user" style={{display:"none"}}/>
    //         <Button size="big" primary 
    //             fluid
    //             onClick = { () => {
    //                 document.getElementById("image").click();
    //                 this.setState({step:'track'})
    //             } }
    //         ><Icon name="add"/> Upload your order</Button>
    //         </>
    //     )
    // }

    // TrackOrder = () => {
    //     return (
    //         <Message icon>
    //             <Icon name='checkmark' primary/>
    //             Your order has been placed 
    //         </Message>
    //     );
    // };

    // StepExampleGroup = () => {
    //     const {step} = this.state;
    //     return (
    //     <Step.Group style={{width:'100%'}}>
    //       <Step active = {step === 'order'} >
    //         <Icon name='cart' />
    //         <Step.Content>
    //           <Step.Title>Upload Order</Step.Title>
    //           <Step.Description>Upload a photo of your order</Step.Description>
    //         </Step.Content>
    //       </Step>
      
    //       <Step  active = {step === 'track'}>
    //         <Icon name='sync alternate' />
    //         <Step.Content>
    //           <Step.Title>Track </Step.Title>
    //           <Step.Description>Track your order status</Step.Description>
    //         </Step.Content>
    //       </Step>
      
    //       <Step  active = {step === 'deliver'}>
    //         <Icon name='truck' />
    //         <Step.Content>
    //           <Step.Title>Order</Step.Title>
    //           <Step.Description>Order will be delivered at the doorstep</Step.Description>
    //         </Step.Content>
    //       </Step>
    //     </Step.Group>
    //     );
    // }

};
export default Home;

// export default withRouter(Signup);