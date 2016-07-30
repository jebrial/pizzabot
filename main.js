
var Tessel = require('tessel-io');
var five = require('johnny-five');
var pizza = require('./order.config');
var config = require('./auth.config');
var pizzapi = require('pizzapi');
var twilioClient = require('twilio')(config.accountSid, config.autToken)


var board = new five.Board({
  io: new Tessel()
});



board.on("ready", () => {

  // set up messaging service
  // set up pizza order service

  var led = new five.Led("a5")
  var button = new five.Button("a2");

  button.on("press", () => {
    led.on()
    // init pizza order
    // request address from messaging and
    orderPizza()
  // set up response listener for address from message
  // on success order pizza
  }
  );
  button.on("release", () => led.off());
});

function sendSms(result) {
  var message;
  if (result) {
    message = "Your pizza is on the way!"
  } else {
    message = "Sorry we cannot order you a pizza. Fix your sofware."
  }
  twilioClient.messages.create({
    body: message,
    to: config.phoneNumber,
    from: config.sendingNumber
  }, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Success')
    }
  })
}

function orderPizza() {
  // Load order config from config.js
  var order = new pizzapi.Order(pizza);
  order.addItem(
    new pizzapi.Item(
      {
        code: '14SCREEN',
        options: [],
        quantity: 1
      }
    ))
  order.place(sendSms)
}
