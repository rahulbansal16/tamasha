import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as firebaseHelper from 'firebase-functions-helper';
import * as express from 'express';
import * as bodyParser from "body-parser";
import { user } from 'firebase-functions/lib/providers/auth';
import {fetchUserIdFromRequest} from './util/util';
// import * as cors from 'cors';
const cors = require('cors')({origin: true});


import * as uuid from 'uuid-random';
// const uuidv4 = require('uuid/v4'); //to give unique name to each file
const {
    fileParser
} = require('express-multipart-file-parser'); 

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const app = express();
// const main = express();

// Automatically allow cross-origin requests
app.use(cors);


app.use(fileParser({
    rawBodyOptions: {
        limit: '15mb',  //file size limit
    },
    busboyOptions: {
        limits: {
            fields: 20   //Number text fields allowed 
        }
    },
}))



const contactsCollection = 'contacts';
// main.use('/', app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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

export const webApi = functions.https.onRequest(app);

const getTimeEpoch = () => {
    return new Date().getTime().toString();
}

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
    return admin.firestore().doc('questions/'+data.eventId + '/questions/' + data.order ).get()
    .then((question: any) => {
        console.log("Successfully fetch the next question", question.data());
        if(question){
            admin.firestore().collection('liveQuestions')
            .doc(data.eventId).
            set(question.data(), {merge: true})
            .then((updateQuestion:any) => {
                console.log("Updated the question", updateQuestion.data());
                return {}
            }).catch(
                err => {
                console.log("Unable to update the liveQuestion", err);
                }
            )
        }
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
    console.log("The user id is", uid);
    console.log("The status path is events/", `${data.eventId}`);
    return admin.firestore().collection('events')
    .doc(`${data.eventId}`)
    .get()
    .then((event:any) => {
        if (event.data().creator === uid){
            console.log();
            return admin.firestore().collection('events').doc(data.eventId).set({
                eventStatus: data.eventStatus
             }, { merge: true})
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

exports.submitUserPayment = functions.https.onCall((data, context) => {
    if (!context || !context.auth){
        throw new functions.https.HttpsError('unauthenticated', "Please sign in to continue")
    }
    const uid = context.auth.uid || null;
    const eventId = data.eventId || null;
    if (!uid){
        throw new functions.https.HttpsError('unauthenticated', "Please sign in to continue")
    } 
    console.log("Updaing the user payment status");
    return admin.firestore().collection('eventRegistration')
    .doc(eventId).collection('users').doc(uid).set({
        paymentStatus: 'received'
    },{merge: true}).then( ()=> {
        return {
            message:'Payment done successfully'
        }
    }).catch(() => {
        return {
            message: 'Error in processing the payments'
        }
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
    return admin.firestore().collection('eventRegistration')
    .doc(data.eventId)
    .collection('users')
    .doc(uid)
    .get()
    .then( snap => {
        if (!snap){
            throw new functions.https.HttpsError('unknown', "Event with the name does not exist")
        }
        console.log("Fetched the Event Info about the required event", snap);
        // const paymentStatuses: any = (snap.data()|| {paymentStatus:[] }).paymentStatus;
        // console.log("Fetching the payment status for the event", paymentStatuses);
        // const paymentIndex = paymentStatuses.indexOf(uid);
        // console.log("Fetching the uid in the payment Status ", paymentIndex);
        // if (paymentIndex !== -1){
        //     console.log("Returing the value", {
        //         uid: uid,
        //         paymentStatus: PaymentStatus.RECEIVED
        //     })
        //     return {
        //         uid: uid,
        //         paymentStatus: PaymentStatus.RECEIVED
        //     }
        // } else {
        //     console.log("Returning the value", {
        //         uid: uid,
        //         paymentStatus: PaymentStatus.PENDING
        //     })
        //     return {
        //         paymentStatus: PaymentStatus.PENDING,
        //         uid: uid
        //     }
        // }
        return {
            uid: uid,
            ...snap.data()
        }
    })
    .catch(err => {
        console.error("Unable to fetch the payment status", err);
        throw new functions.https.HttpsError('unknown', "Error fetching the payment status")
    }) 
})
exports.endContest = functions.https.onCall((data, context) => {
    if (!context || !context.auth){
        throw new functions.https.HttpsError('unauthenticated', "Please sign in to continue")
    }

    const uid = context.auth.uid || null;
    if (!uid){
        throw new functions.https.HttpsError('unauthenticated', "Please sign in to continue")
    } 

    admin.firestore().collection('liveAnswers').doc(data.eventId).delete().then().catch();
    return admin.firestore().collection('liveQuestions').doc(data.eventId).delete().
    then().
    catch(
        err =>{
            console.log("Error deleting the live event information", err);
            throw new functions.https.HttpsError('unknown', "Unable to delete the live Event Questions")
        }
    );
    // admin.firestore().collection().doc().withConverter()
})

exports.registerUserForEvent = functions.https.onCall((data, context) => {

    if (!context || !context.auth){
        throw new functions.https.HttpsError('unauthenticated', "Please sign in to continue")
    }

    const uid = context.auth.uid || null;
    if (!uid){
        throw new functions.https.HttpsError('unauthenticated', "Please sign in to continue")
    }

    return admin.firestore().collection('events').doc(data.eventId).get()
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

exports.submitComment = functions.https.onCall((data, context) => {

    if (!context || !context.auth){
        throw new functions.https.HttpsError('unauthenticated', "Please sign in to continue")
    }

    const uid = context.auth.uid || null;
    if (!uid){
        throw new functions.https.HttpsError('unauthenticated', "Please sign in to continue")
    }
    console.log( getTimeEpoch());

    return admin.firestore().collection('comments').doc(data.eventId).collection('comments').doc( getTimeEpoch()).set({
        text: data.text,
        author: data.author,
        image: data.image
    }, {merge: true}).
    then().
    catch(
        err =>{
            console.log("Error adding the comment", err);
            throw new functions.https.HttpsError('unknown', "Error adding the comment")
        }
    );

})

const uploadImageToStorage = (file: any, uploadName: any) => {
    const bucket = admin.storage().bucket();
    let prom = new Promise((resolve, reject) => {
        if (!file) {
            reject('No image file');
        }
        let newFileName = uploadName;

        let fileUpload = bucket.file(newFileName);
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });

        blobStream.on('error', (error) => {
            reject('Something is wrong! Unable to upload at the moment.');
        });

        blobStream.on('finish', () => {
            const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`; //image url from firebase server
            console.log(url)
            resolve(url);
        });

        blobStream.end(file.buffer);
    });
    return prom;
}

app.options('/post', function (req:any, res:any){
    res.set("Access-Control-Allow-Origin", "*"); // you can also whitelist a specific domain like "http://127.0.0.1:4000"
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.status(200).send();
})

app.post('/post', function (req: any, res) {
    // const {
        //     fieldname,
        //     originalname,
        //     encoding,
        //     mimetype,
        //     buffer,
        // } = req.files[0]
    console.log('In the post request of the ap')
        res.set("Access-Control-Allow-Origin", "*"); // you can also whitelist a specific domain like "http://127.0.0.1:4000"
        res.set("Access-Control-Allow-Headers", "Content-Type");
    var uploadName = uuid() + '.png';
    console.log('After the uploadName generation');
    // I need to fetch the uid at this point of time so that I can tell which user did that
    // It is going to be an easy task
    console.log('This is the log because of the eid',  getTimeEpoch())
 
    // admin.firestore().collection('files').doc(uploadName).set({
    //     fileName: uploadName,
    //     uploadDate: new Date(),
    //     text: req.body.text
    // })
    var addFilePromise: any;
    if(req.files[0]){
        addFilePromise = uploadImageToStorage(req.files[0], uploadName);
    
     } else {
         return res.status(200);
     }

     return addFilePromise.then( () =>
        admin.firestore().collection('comments').doc(req.body.eventId).collection('comments').doc( getTimeEpoch()).set({
            text: req.body.text,
            author: req.body.author,
            imageSrc: uploadName
        }, {merge: true}).then( () => res.status(200).send(
            {
                success:'File upload successful' 
            }) )
     ).catch(
        () => 
            res.status(500).send({
             error:'Unable to upload file. Please try again' 
           })
    )
    // var addEntryPromise = 
    // admin.firestore().collection('comments').doc(req.body.eventId).collection('comments').doc( getTimeEpoch()).set({
    //     text: req.body.text,
    //     author: req.body.author,
    //     imageSrc: uploadName
    // }, {merge: true});
    // return Promise.all([addEntryPromise, addFilePromise]).then(
    //     () => {
    //         return res.status(200).send({
    //             success:'File upload successful'
    //         })
    //     }
    // ).catch( 
    //     () => {
    //        return res.status(500).send({
    //         error:'Unable to upload file. Please try again' 
    //       })
    // })
})

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
        .set({
            question: question,
            id: id,
            options: options
        }, {merge: true})
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

app.post('/event/:eventId/comment', (req, res) => {
    // 
})

app.get('/event/:eventId/question/:questionID/submit', (req, res) => {

    // I am submitting the answer to a particular question in my codebase
    // userAnswer/:userId/event/:eventId/

    const userId = "rahul" 
    const eventId = "evend"
    // const eventId = req.params.eventId
    // const eventCollectionPath = 'userAnswer/' + userId + '/' + 'event' + '/' + eventId
    // const questionID:string = req.params.questionID.toLowerCase()
    let ob = {'randomQuestionID': 'answer'};
    // ob[questionID] = "rahul"

    admin.firestore().collection('userAnswer').doc(userId).collection('event').doc(eventId).set(ob, {merge:true})
    .then(() => res.send("creating document"))
    .catch(() => res.send("failed to create document"))

    // const questionID = req.params.questionID
})
