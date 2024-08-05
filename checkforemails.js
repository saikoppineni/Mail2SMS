const fs = require('fs')
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const bodyParser = require('body-parser');
const { listEmails } = require('./listemails')

// const User = require('./User')
// var currentUser;
function checkForNewEmails(credentials, userPhoneNumber,priorityEmails) {
    console.log("checkforemails called!!!!")
    const token = JSON.parse(fs.readFileSync('user_token.json'));

    const oAuth2Client = new google.auth.OAuth2(
        credentials.client_id,
        credentials.client_secret,
        credentials.redirect_uri
    );
    oAuth2Client.setCredentials(token);

    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    
    listEmails(gmail, userPhoneNumber, priorityEmails)
        .then((emailList) => {
            // You can render the email list or send it as a JSON response
            console.log(emailList)
        })
        .catch((error) => {
            console.log(error)
        });
}

module.exports = { checkForNewEmails };