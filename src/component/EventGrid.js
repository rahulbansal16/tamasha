import React from 'react';
import { Loader } from 'semantic-ui-react';
import Event from './Event';

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
        const eventResult = await this.props.fetchEventResult();
        if (!eventResult){
            console.log("Unable to fetch the eventResult, some error occured");
            return 
        }
        eventResult.docs.map( doc => result.push({...doc.data(), id:doc.id}));
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
            this.state.result.map( card => (<Event key = {card.id} card={card} onCardClick={this.props.onCardClick}/>))
        );
    }

}

export default EventGrid;