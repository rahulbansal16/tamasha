import React from 'react';
import {Container} from 'semantic-ui-react'
import {functions} from '../firebase';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import AppLoader from '../component/AppLoader'


class Success extends React.Component {

    componentDidMount = async () => {
        // This will make an entry in the system for this user
        const id = this.props.event ? this.props.event.id : null || 'akshay_live_stream';
        // id = 'akshay_live_stream'
        // if (!id)
            // return
        const submitUserPayment = functions.httpsCallable('submitUserPayment');
        const res = await submitUserPayment({
            eventId: id || 'akshay_live_stream'
        });
        // pushing to the event after everything is done
        this.props.history.push({
            pathname:  '/event/' + id +'/live',
            event: null
        })
    }

    render(){
        return(
            <AppLoader loading ={true} text = {'Confirming Payment'}> 
                This is the success page for the Event
            </AppLoader>
        );
    }

}

const mapStateToProps = state => {
    return {
        event: state.event
    }
}

export default connect(mapStateToProps, null)(withRouter(Success));