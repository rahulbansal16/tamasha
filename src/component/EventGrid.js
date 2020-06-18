import React from 'react';
import { Loader, Segment } from 'semantic-ui-react';
import { getEventsFromFireStore } from '../firebase';
import Event from './Event';
import {db} from '../firebase';

class EventGrid extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            isLoading : true,
            fetchedCards: [],
            result: []
        }
    }

    componentDidMount = async() => {
        let result = []
        const events = await db.collection('events').get();
        events.docs.map( doc => result.push({...doc.data(), id:doc.id}));
        this.setState({
            result: result,
            isLoading:false
        })
    }

    playLoader = () => {
        return (
            <div style = {{ height:'100%', marginTop:'100px'}} className = "centerIt">
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