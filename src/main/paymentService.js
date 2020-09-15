import {functions} from '../firebase';

export const fetchPaymentStatus = async (eventId) => {
    try {
      const paymentStatus = functions.httpsCallable('fetchUserPayment');
      let res = await paymentStatus({eventId: eventId});
      return res.data.paymentStatus
    }
    catch (err){
      console.error("Error fetching the payment status", err);
      return undefined;
    }
}