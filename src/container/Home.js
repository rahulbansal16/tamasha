import React from 'react';
import {Header, Container, Loader} from 'semantic-ui-react'
import EventGrid from './../component/EventGrid';
class Home extends React.Component {


    render(){
        return(
            <Container fluid>
                <Header textAlign='center' as='h1' content="Tamasha Live"/>
                <EventGrid/>
            </Container>
        );
    }
};
export default Home;
