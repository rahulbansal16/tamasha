
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
const firebaseConfig = {
  apiKey: "AIzaSyDgmE5U_WIDVoonJlOC2QpiAMxKBjXil4M",
  authDomain: "tamasha-c84b1.firebaseapp.com",
  databaseURL: "https://tamasha-c84b1.firebaseio.com",
  projectId: "tamasha-c84b1",
  storageBucket: "tamasha-c84b1.appspot.com",
  messagingSenderId: "604851226714",
  appId: "1:604851226714:web:9edbf59fea8d6a5e20b063",
  measurementId: "G-EWH840RHDD"
};
firebase.initializeApp(firebaseConfig);

// PhoneProvider.PROVIDER_ID;
export const auth = firebase.auth();
export const functions = firebase.functions();
// firebase.analytics();
firebase.auth().useDeviceLanguage();
export const firestore = firebase.firestore();
export const db = firestore;
// const provider = new firebase.auth.GoogleAuthProvider();
// const db = firebase.database()



// window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
//   'size': 'invisible',
//   'callback': function(response) {
//     // reCAPTCHA solved, allow signInWithPhoneNumber.
//     // onSignInSubmit();
//   }
// });





// export const signInWithGoogle = () => {
//   auth.signInWithRedirect(provider);
// };

export const generateUserDocument = async (user, additionalData) => {
  if (!user) return;
  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();
  if (!snapshot.exists) {
    const { email, displayName, photoURL } = user;
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        ...additionalData
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
  return getUserDocument(user.uid);
};

const getUserDocument = async uid => {
  if (!uid) return null;
  try {
    const userDocument = await firestore.doc(`users/${uid}`).get();
    return {
      uid,
      ...userDocument.data()
    };
  } catch (error) {
    console.error("Error fetching user", error);
  }
};

export const getUserDocumentByEmail = async email => {
  if (!email) return null;
  try {
    let usersRef =  firestore.collection('users');
    let user = (await usersRef.where('email', '==', email).get()).docs[0];
    return user.data();
  } catch (error) {
    console.log("Error querrying the usrers", error)
  }
}

export const addEventsToFireStore = async (event) => {
  if(!event) return null;
  let eventRef = await firestore.doc(`events/${event.id}`);
  const snapshot = await eventRef.get();
  if(!snapshot.exists){
    try {
      await eventRef.set(event);
    } catch (error) {
      console.log("Unable to create the event", error);
    }
  }
  try {
    await eventRef.update(event);
  } catch(error) {
    console.log("Unable to update the event",error);
  }
}


export const addPost = async (post) => {
  if(!post) return null;
  return firestore.collection('post').add(post);
}

export const getEventsFromFireStore = async () => {
  let eventsRef = firestore.collection('events');
  let events = (await eventsRef.where('startEpoch', '>=' , new Date()).get())
  if (events.empty) {
    return [];
  } else {
    let eventsData = []
    events.forEach(doc => eventsData.push(doc.data()));
    console.log("Printing the events", eventsData);
    return eventsData;
  }
}

export const getEventsById = async (id) => {
}
