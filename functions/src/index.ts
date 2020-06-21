import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as firebaseHelper from 'firebase-functions-helper';
import * as express from 'express';
import * as bodyParser from "body-parser";
import { user } from 'firebase-functions/lib/providers/auth';
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
    admin.firestore().collection('event').add({})
    .then()
    .catch()
})

app.get('/event/:id', (req, res) => {
    // This will let user details about the particular event
})

// TODO: Add authentication so that only creator can access the 
// Fetches all the registered users
app.get('/event/:id', (req, res) => {
    // Figure out the logic to add the user in the par
    // res.send(req.params.id);    
    admin.firestore().doc('eventRegistration/' + req.params.id).get()
    .then(snap => res.send(snap.data()))
    .catch(() => res.send("failed"))
    // res.send({id: req.params.id})
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

app.get('/event/:eventID:/question/:questionID/submit', (req, res) => {

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