var options = {  
        amount: 50000,  
        currency: "INR", 
        receipt: "order_rcptid_11"
    };
instance.orders.create(options, function(err, order) {  
    console.log(order);
});

// curl  -X POST https://api.razorpay.com/v1/orders
// -H 'content-type:application/json'
// -d '{
//     "amount": 50000,
//     "currency": "INR",
//     "receipt": "rcptid_11"
// }'