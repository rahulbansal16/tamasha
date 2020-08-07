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

export const EventStatus = {
    LIVE: 'live',
    UPCOMING: 'upcoming',
    CANCELLED: 'cancelled'
};

export const PaymentStatus = {
    PENDING: 'pending',
    RECEIVED: 'received'
}

export const webApi = functions.https.onRequest(main);

exports.addUserEntry = functions.auth.user().onCreate( (userData) => {
    admin.firestore().collection('users').add(userData)
    .then( () => console.log("Created a new user in the table", userData))
    .catch( () => console.log("Unable to add user in the users table", userData))
})

exports.createQuestions = functions.https.onCall((data, context) => {
    console.log("Pushing the questions in the event");
    if (!context || !context.auth){
        console.error("Error auth", data)
        throw new functions.https.HttpsError('unauthenticated', "Please sign in to continue")
    }
    const uid = context.auth.uid || null;
    if (!uid){
        throw new functions.https.HttpsError('unauthenticated', "Please sign in to continue")
    }
    // TODO: Add the logic of allowing only creator to edit this
    var batch = admin.firestore().batch()
    data.questions.forEach((question: any) => {
        console.log('questions/' + data.eventId + '/questions/'+ question['order'])
        const questionsRef = admin.firestore().collection('questions/' + data.eventId + '/questions/').doc(`${question['order']}`);
        batch.set(questionsRef, question)
    });
    batch.commit().then().catch();
})

exports.revealAnswer = functions.https.onCall((data, context) => {
    console.log("Revealing the answer");
    if (!context || !context.auth){
        console.error("Error auth", data)
        throw new functions.https.HttpsError('unauthenticated', "Please sign in to continue")
    }
    const uid = context.auth.uid || null;
    if (!uid){
        throw new functions.https.HttpsError('unauthenticated', "Please sign in to continue")
    }  
    console.log("The data is", data);
    admin.firestore().doc('questionBank/' + data.questionId).get()
    .then((answer: any) => {
        console.log("Successfully push the next Answer", answer.data());
        admin.firestore().collection('liveAnswers')
        .doc(data.eventId).
        set({...answer.data()}, {merge: true})
        // update(question.data())
        .then((updateAnswer:any) => {
            console.log("Updated the Answer", updateAnswer.data());
        }).catch(
            err => {
                console.log("Unable to update the Answer", err);
            }
        )
    })
    .catch( err => {
        console.log("Unable to fetch the question", err);
        throw new functions.https.HttpsError('unknown', "Unknown error while updating the status")
    })
})

exports.pushNextQuestion = functions.https.onCall((data, context) => {
    console.log("Pushing the next question");
    if (!context || !context.auth){
        console.error("Error auth", data)
        throw new functions.https.HttpsError('unauthenticated', "Please sign in to continue")
    }
    const uid = context.auth.uid || null;
    if (!uid){
        throw new functions.https.HttpsError('unauthenticated', "Please sign in to continue")
    }
    // For pushing the next questions the user will create 
    // Add a check only if the user of the app is able to ac
    console.log("The data is", data);
    // admin.firestore().collection('questions').doc(data.eventId)
    // .collection(data.order).doc('questions').get()
    admin.firestore().doc('questions/'+data.eventId + '/' + data.order + '/questions').get()
    .then((question: any) => {
        console.log("Successfully fetch the next question", question);
        admin.firestore().collection('liveQuestions')
        .doc(data.eventId).
        update(question.data())
        .then((updateQuestion:any) => {
            console.log("Updated the question", updateQuestion.data());
            return {}
        }).catch(
            err => {
                console.log("Unable to update the liveQuestion", err);
            }
        )
    })
    .catch( err => {
        console.log("Unable to fetch the question", err);
        throw new functions.https.HttpsError('unknown', "Unknown error while updating the status")
    })
})

exports.updateEventStatus = functions.https.onCall((data, context) => {
    if (!context || !context.auth){
        throw new functions.https.HttpsError('unauthenticated', "Please sign in to continue")
    }
    const uid = context.auth.uid || null;
    if (!uid){
        throw new functions.https.HttpsError('unauthenticated', "Please sign in to continue")
    }
    admin.firestore().collection('events')
    .doc(data.eventId)
    .get()
    .then((event:any) => {
        if (event.data().creator === uid){
            console.log();
            admin.firestore().collection('events').doc(data.eventID).update({
                eventStatus: data.eventStatus
             })
             .then( (result) => result)
             .catch( err => {
                 console.error("Unable to update the event status", err);
                 throw new functions.https.HttpsError('unknown', "Unknown error while updating the status")
                })

        } else {
            console.error("User ${0} not allowed to edit the event ${1} status", uid, data.eventId)
            throw new functions.https.HttpsError('permission-denied', "User not allowed to edit the event status")
        }
    })
    .catch( err => {
        console.error("Unable to fetch the event status", err);
        throw new functions.https.HttpsError('unknown', "Unknown error while fetching the status")
    })
    
})

exports.fetchUserPayment = functions.https.onCall((data, context) => {
    if (!context || !context.auth){
        throw new functions.https.HttpsError('unauthenticated', "Please sign in to continue")
    }
    const uid = context.auth.uid || null;
    if (!uid){
        throw new functions.https.HttpsError('unauthenticated', "Please sign in to continue")
    }
    console.log("Checking the fetchUserPayment api");
    admin.firestore().collection('eventRegistration')
    .doc(data.eventId)
    .get()
    .then( snap => {
        if (!snap){
            throw new functions.https.HttpsError('unknown', "Event with the name does not exist")
        }
        console.log("Fetched the Event Info about the required event", snap);
        const paymentStatuses: any = (snap.data()|| {paymentStatus:[] }).paymentStatus;
        console.log("Fetching the payment status for the event", paymentStatuses);
        const paymentIndex = paymentStatuses.indexOf(uid);
        console.log("Fetching the uid in the payment Status ", paymentIndex);
        if (paymentIndex !== -1){
            console.log("Returing the value", {
                uid: uid,
                paymentStatus: PaymentStatus.RECEIVED
            })
            return {
                uid: uid,
                paymentStatus: PaymentStatus.RECEIVED
            }
        } else {
            console.log("Returning the value", {
                uid: uid,
                paymentStatus: PaymentStatus.PENDING
            })
            return {
                paymentStatus: PaymentStatus.PENDING,
                uid: uid
            }
        }
    })
    .catch(err => {
        console.error("Unable to fetch the payment status", err);
        throw new functions.https.HttpsError('unknown', "Error fetching the payment status")
    }) 
})

exports.registerUserForEvent = functions.https.onCall((data, context) => {

    if (!context || !context.auth){
        throw new functions.https.HttpsError('unauthenticated', "Please sign in to continue")
    }

    const uid = context.auth.uid || null;
    if (!uid){
        throw new functions.https.HttpsError('unauthenticated', "Please sign in to continue")
    }

    admin.firestore().collection('events').doc(data.eventId).get()
    .then(event => {
        if (!event){
            throw new functions.https.HttpsError('unknown', "Event with the name does not exist")
        }
        admin.firestore().collection('eventRegistration').doc(data.eventId).set({
            users: admin.firestore.FieldValue.arrayUnion(uid),
            payment: admin.firestore.FieldValue.arrayUnion({uid: uid,
                 amount: data.amount,
                 referenceId: data.referenceId
                }),
            creator: (event.data() || {}).creator
        })
        .then( snap => {
            console.log("Added the user successfully");
            return {
                success:true,
                message:"successfully registered for the event"
            }
        })
        .catch( error => {
            console.log("Failed to register a user")
            throw new functions.https.HttpsError('unknown', error.message, error)
        });
    }).catch( err => {
        throw new functions.https.HttpsError('unknown', "Event with the name does not exist")
    })
   
    // const name = context.auth.token.name || null;
    // const picture = context.auth.token.picture || null;
    // const email = context.auth.token.email || null;
});

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