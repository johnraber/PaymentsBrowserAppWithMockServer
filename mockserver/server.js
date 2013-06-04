// http://nodejs.org/api/util.html
var util = require('util');

// Setup mongoose and the database
// Check out ./config-sample to configure your MongoDb, rename it to config.js
var mongoose = require('mongoose/');
var config = require('./config'); // Local congig file to hide creds

db = mongoose.connect(config.creds.mongoose_auth),
Schema = mongoose.Schema;  

// require restify and bodyParser to read Backbone.js syncs
var restify = require('restify');  
var server = restify.createServer();

//disable copying k/v pairs from the request body into req.params
server.use(restify.bodyParser({mapParams: false }));

// using console.log for now instead of logger
//server.use(restify.requestLogger());

var PaymentSchema = new Schema({
   id: String,
   create_time: { type: Date, default: Date.now },
   intent: String,
   state: String,
   payer: {
      payment_method: String,
      funding_instruments: [
        {
          //   id: String,
          credit_card: String,
          credit_card_token: String
        }],
      payer_info: {
        email: String,
        first_name: String,
        last_name: String,
        payer_id: String,
        phone: String
      }
    },
   transactions: [ 
    {
 //  id: String,
      description: String,
      payee: {
        email: String,
        merchant_id: String,
        phone: String
      },
      amount: {
        currency: String,
        details: {
          shipping: String,
          subtotal: String,
          tax: String,
          fee: String
        }
      }
    }
   ]
}, { strict: true } );
mongoose.model('Payment', PaymentSchema); 


var Payment = mongoose.model('Payment'); 


// This function is responsible for returning all entries for the Order model
function getPayments(req, res, next) {
  // Resitify currently has a bug which doesn't allow you to set default headers
  // This headers comply with CORS and allow us to server our response to any origin
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  Payment.find().limit(20).sort('date', -1).execFind(function (arr,data) {
    res.send(data);
  });
}

function getPayment(req, res, next) {
  // Resitify currently has a bug which doesn't allow you to set default headers
  // This headers comply with CORS and allow us to server our response to any origin
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  var payment = new Payment();
  Payment.findById(req.params.id, function (err, payment) {
    console.log("Mongoose Payment object after retrieving from MongoDB: ", JSON.stringify(payment) );
    res.send(payment);
  });
}

function putPayment(req, res, next) {
  // Resitify currently has a bug which doesn't allow you to set default headers
  // This headers comply with CORS and allow us to server our response to any origin
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
 
  console.log("Mongoose Payment object to use request body to update from PUT: ", util.inspect(req.body, false, null) );

  Payment.update( { _id: req.params.id }, req.body, function (err, numberAffected, raw) {
    if (err) return handleError(err);
    console.log('The number of updated documents was %d', numberAffected);
    console.log('The raw response from Mongo was ', raw);
    res.send(raw);
  });
}

// function cancelPayment(req, res, next) {
//   // Resitify currently has a bug which doesn't allow you to set default headers
//   // This headers comply with CORS and allow us to server our response to any origin
//   res.header("Access-Control-Allow-Origin", "*"); 
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");

//   console.log("Mongoose Payment object to use request body to update: ", util.inspect(req.body, false, null) );
//   Payment.update( { _id: req.params.id}, {state: req.body.state }, function() {
//      // if (err) { res.send(err); }
//     res.send(req.body);
//   });
// }

function postPayment(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  console.log("Request body to use to create a Mongoose Payment: ", util.inspect(req.body, false, null));
//  console.log("Payment request body: ", req.body);
  // Create a new  model, fill it up and save it to Mongodb
  var payment = new Payment( req.body );
  console.log("Mongoose Payment object after creating from request body: ", util.inspect(payment, false, null) );


  payment.save( function(err, payment) {
    if(err) {  
       // need to return error
    }
    else {
      res.send(payment);
    }
  });
}

function patchPayment(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  console.log("Mongoose Payment object to use request body to update using PATCH: ", util.inspect(req.body, false, null) );

  Payment.update( { _id: req.params.id }, req.body, function (err, numberAffected, raw) {
    if (err) return handleError(err);
    console.log('The number of updated documents was %d', numberAffected);
    console.log('The raw response from Mongo was ', raw);
    res.send(raw);
  });
}



// Set up our routes and start the server
server.get('/v1/payments/payment', getPayments);
server.get('v1/payments/payment/:id', getPayment);
server.post('/v1//payments/payment', postPayment);
server.put('/v1/payments/payment/:id', putPayment);
//server.del('/v1/payments/payment/:id', cancelPayment);
server.patch('/v1/payments/payment/:id', patchPayment);


server.listen(8090, function() {
  console.log('%s listening at %s, love & peace', server.name, server.url);
});
    