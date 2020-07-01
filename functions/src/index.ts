import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as firebaseHelper from 'firebase-functions-helper';
import * as express from 'express';
import * as bodyParser from "body-parser";
import { user } from 'firebase-functions/lib/providers/auth';
import {fetchUserIdFromRequest} from './util/util';

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const app = express();
const main = express();

const contactsCollection = 'contacts';
main.use('/', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

// webApi is your functions name, and you will pass main as 
// a parameter

export const webApi = functions.https.onRequest(main);

app.get('/contacts', (req, res) => {
    firebaseHelper.firestore
        .backup(db, contactsCollection)
        .then(data => res.status(200).send(data))
        .catch(error => res.status(400).send(`Cannot get contacts: ${error}`));
})


// TODO: Add authentication before creating the event
app.post('/event', (req, res) => {

    const event:any = {
        name: req.body.name,
        description: req.body.description,
        creator: fetchUserIdFromRequest(req),
        videoStreamUrl: 'https://www.youtube.com',
        eventDate: new Date()
    }

    console.log("Post: /event creation request", event);
    admin.firestore().collection('events').add(event)
    .then( snap => {
        console.log("The document was written successfully");
        res.send({
            id: snap.id,
            success: true
        })
    })
    .catch( () => {
        console.log("Error creating an event");
        res.send({
            success:false,
            error:'Unable to create an Event'
        })
    })
})

// TODO: Add authentication so that only creator can access the 
// Fetches all the registered users
app.get('/event/:id', (req, res) => {
    admin.firestore().doc('events/' + req.params.id).get()
    .then(snap => res.send(snap.data()))
    .catch(() => res.send("failed"))
})

// TODO: Add user authentication
app.post('/event/:id/register', (req, res) => {
    // TODO: Add the edge case of not adding the creator id in the users list

    // const user = req.params.id + new Date().toDateString()
    // TODO: Fetch the user value from the header instead of accessing it from the 
    
    admin.firestore().doc('eventRegistration/' + req.params.id)
    .update({users: admin.firestore.FieldValue.arrayUnion(user)})
    .then(() => res.send("done"))
    .catch(() => res.send("oops"))
})

// API to push questions to the events

app.post('/event/:id/question/:number', (req, res) => {

    console.log("Hitting the API to push data to the live questions")
    // Check if the user has access to the mentioned event or not

    const eventId = req.params.id;
    const questionNumber = req.params.number

    if ( !eventId || !questionNumber){
        res.send({
            error: "EventId and Question Number are required",
            success: false
        })
    }
    admin.firestore()
    .doc('eventQuestion/' + eventId +'/questions/'+ questionNumber)
    .get()
    .then( snap => {
        const {question, id, options}: any = snap.data();
        admin.firestore()
        .doc('liveQuestions/' + eventId)
        .update({
            question: question,
            id: id,
            options: options
        })
        .then(() => res.send({
            success: true
        }))
        .catch(() => res.send({
            error: "Unable to update the liveQuestion",
            success: false
        }))
    })
    .catch(() => {
        console.log("Unable to update the questions")
        res.send({
            error:'Unable to update the Questions',
            success: false
        })
    })
});

app.get('/event/:eventID/question/:questionID/submit', (req, res) => {

    // I am submitting the answer to a particular question in my codebase
    // userAnswer/:userId/event/:eventId/

    const userID = "rahul" 
    const eventID = "evend"
    // const eventID = req.params.eventID
    // const eventCollectionPath = 'userAnswer/' + userID + '/' + 'event' + '/' + eventID
    // const questionID:string = req.params.questionID.toLowerCase()
    let ob = {'randomQuestionID': 'answer'};
    // ob[questionID] = "rahul"

    admin.firestore().collection('userAnswer').doc(userID).collection('event').doc(eventID).set(ob, {merge:true})
    .then(() => res.send("creating document"))
    .catch(() => res.send("failed to create document"))

    // const questionID = req.params.questionID
})