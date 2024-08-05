const { sendSMS } = require('./test')

async function listEmails(gmail, userPhoneNumber, userPriorityEmails) {
    try {
        const response = await gmail.users.messages.list({
            userId: 'me',
            q: 'is:unread',
            format: 'full'
        });
        const messages = response.data.messages;
        if (messages) {
            console.log('Priority Emails:');
            for (const message of messages) {
                const messageDetails = await gmail.users.messages.get({
                    userId: 'me',
                    id: message.id,
                    q: 'is:unread',
                    format: 'full' // Request the full email content
                });

                const senderInfo = messageDetails.data.payload.headers.find(header => header.name === 'From');
                const senderEmailMatch = senderInfo.value.match(/<([^>]+)>/);

                if (senderEmailMatch) {
                    const senderEmail = senderEmailMatch[1];
                    // Check if the sender's email matches any of the user's priority emails
                    if (userPriorityEmails.includes(senderEmail)) {
                        const subject = messageDetails.data.payload.headers.find(header => header.name === 'Subject').value;
                        const body = messageDetails.data.snippet; // Message body

                        console.log('Subject:', subject);
                        console.log('Sender Name:', senderInfo.name);
                        console.log('Sender Email:', senderEmail);
                        console.log('Message Body:', body);
                        console.log('-------------------------');

                        var text = "You got an email from " + senderEmail + "\nSubject: " + subject;
                        sendSMS(text, userPhoneNumber);
                    }
                }
            }
        }
        else {
            console.log('No emails found.');
        }
    } catch (error) {
        console.error('Error listing emails:', error);
    }
}



module.exports = { listEmails }