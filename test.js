const twilio = require('twilio');

const client = new twilio('AC69607f43635b6d7e6dc4d51d88487777', 'a811b8f73fa5a282506d65e81030bb2c');
const twilionumber = "+15173069838"
// Function to send an SMS
function sendSMS(message, toPhoneNumber) {
  client.messages
    .create({
      body: message,
      from: twilionumber,
      to: toPhoneNumber,
    })
    .then((message) => console.log('SMS sent:', message.sid))
    .catch((error) => console.error('Error sending SMS:', error));
}

module.exports = {sendSMS};
