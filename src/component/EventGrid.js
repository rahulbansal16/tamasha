import React from 'react';
import { Loader, Segment } from 'semantic-ui-react';
import { getEventsFromFireStore } from '../firebase';
import Event from './Event';

class EventGrid extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            isLoading : false,
            fetchedCards: [],
            result: []
        }
    }

    componentDidMount = async() => {
        // const events = await getEventsFromFireStore();
        const events = [{}, {}]
        this.setState({
            isLoading: false,
            result: events
        })
    }

    playLoader = () => {
        return (
            <div style = {{ height:'100%'}} className = "centerIt">
                <Loader active content='Loading' size='big' inline='centered'/>
            </div>
        );
    }

    render(){
        return (
            this.state.isLoading ? this.playLoader() :
            this.state.result.map( card => (<Event card={card}/>))
        );
    }

}

export default EventGrid;