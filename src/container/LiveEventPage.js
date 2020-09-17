import React from 'react';
import {Button, Container, Header, Loader} from 'semantic-ui-react';
import {withRouter} from "react-router-dom";
import Quiz from '../component/Quiz'
import {db} from '../firebase';
import {EventStatus, PaymentStatus} from '../Const';
import AppLoader from '../component/AppLoader';
import {LiveComment} from '../component/Comment'
import ChatComponent from '../component/ChatComponent';
import {fetchPaymentStatus} from '../main/paymentService'

// Add a column telling the user that the event has not started yet and
class LiveEventPage extends React.Component {

    // TODO: Add the logic of highlighting the 
    // answer when the answer is revealed
    state = {
        eventStatus: EventStatus.UPCOMING,
        answer:undefined,
        event: undefined,
        loading: true,
        paymentDone: true,
        comments: [
        ]
    }

    constructor(props) {
        super(props)
        this.commentRef = React.createRef()
    }

    submitTheAnswer = async () => {
        // TODO: Make an API call to the server to submit it
    }

    registerToLiveComments = async (id) => {
        db.collection('comments').doc(id).collection('comments').onSnapshot (
            comments  => 
            {
                let result = []
                if (!comments){
                    console.log("Unable to fetch the comments");
                    return 
                }
                // Add the snippet to scroll to the bottom of the page
                comments.docChanges().map( doc => result.push({...doc.doc.data(), id:doc.doc.id}));
                this.setState( {
                    comments: this.state.comments.concat(result),
                    loading: false
                })
                this.scrollToBottom()
            }
        )
    }

    populateComments = () => {
        return this.state.comments.map( comment => 
        <LiveComment key = {comment.id} text={comment.text} author = {comment.author}
        imgSrc = {comment.imageSrc}></LiveComment>)
    }

    componentDidMount = async () => {
        let eventId  = this.props.match.params.id
        // TODO:: uncomment the below code for the quiz part
        // let videoStreamUrl = this.props.location.videoStreamUrl;
        // let event = this.props.location.event;
        // if (!videoStreamUrl){
        //     event = (await db.collection('events').doc(id).get()).data()
        // }
        // this.setState({
        //     loading: false,
        //     videoStreamUrl: event.videoStreamUrl,
        //     event: event,
        //     eventStatus: event.eventStatus
        // })
        this.registerToLiveComments(eventId)
        const paymentStatus = await fetchPaymentStatus(eventId);
        this.setState ( {
            paymentDone: paymentStatus === PaymentStatus.RECEIVED
        })
    };

    populateEvent = (id,answer) => {
        console.log("Populating the event", this.state.event);
        if (this.state.loading)
            return
        return(
                <>
                <iframe title = {this.state.event.name} width="560" height="315" src={this.state.videoStreamUrl} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                <Quiz event = {id || 'fm'} answer={answer}/>
                </>
            );
    }

    eventNotLive = () => {
        return (
            <>
                <Header as='h3' textAlign="center"
                    content='Wating for the Host to start the Event'/>
                <Loader active inline="centered" content = {"Fetching the Event Status"}></Loader>
                {/* <Header as="h4" textAlign="center" content="Refresh to continue"/> */}
            </>
        );
    }

    scrollToBottom = () => {
        this.commentRef.current.scrollIntoView(true)
    }
    

    render () {
        let id  = this.props.match.params.id
        console.log("The id of the event is", id);
        return(
            <Container >
                <AppLoader loading = {this.state.loading} text="Connecting to Live Event">
                        <Header as='h3' dividing>
                            Comments
                        </Header>
                        {this.populateComments()}
                        {/* // this.state.eventStatus === EventStatus.LIVE?
                        // this.populateEvent(id):
                        // this.eventNotLive() */}
                        <ChatComponent id = {this.props.match.params.id}
                        disabled = {!this.state.paymentDone}/>
                        <div  ref = {this.commentRef}></div>

                    </AppLoader>
            </Container>
            // </div>
        );
    }
}
export default withRouter(LiveEventPage);