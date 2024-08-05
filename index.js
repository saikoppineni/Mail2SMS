const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const fs = require('fs');
const { checkForNewEmails } = require('./checkforemails');
const { listEmails } = require('./listemails');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from a .env file
console.log(process.env.REDIRECT_URI)
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

const tokenPath = 'user_token.json';
var userPhoneNumber =""
var priorityEmails = []

const oauth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/oauth/authorize', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly'],
  });
  res.redirect(url);
});

app.get('/oauth/callback', async (req, res) => {
  console.log("success")
  const code = req.query.code;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    fs.writeFileSync(tokenPath, JSON.stringify(tokens));
    res.redirect('/add-mobile');
  } catch (error) {
    res.send('Error authorizing the app: ' + error);
  }
});

app.get('/display-mails', (req, res) => {
  res.render('display.ejs', { priorityEmails });
});

app.post('/add-to-priority', (req, res) => {
  const mail = req.body.email;
  console.log(mail);
  priorityEmails.push(mail);
  res.redirect('/display-mails');
});

app.get('/add-mobile', (req, res) => {
  res.render('phone.ejs');
});

app.post('/add-mobile/tovar', (req, res) => {
  userPhoneNumber = "+91" + req.body.mobileInput;
  console.log(userPhoneNumber);
  startEmailPolling();
  res.redirect('/display-mails');
});

// Centralized polling logic
function startEmailPolling() {
  console.log('Start Email Polling');
  setInterval(() => {
    checkForNewEmails({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
    }, userPhoneNumber, priorityEmails);
  }, 30000);
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  if(userPhoneNumber != ""){
    startEmailPolling();
  }
});
