import {db} from '../firebase';
export const fetchEvent = async (eventId) => {
    let eventData = null;
    try {
            eventData = (await db.collection('events').doc(eventId).get()).data()
    }
    catch(err){
        console.error("Error fetching the event", err)
    }
    return eventData
}